import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FinanzasService } from '../services/finanzas.service';
import { Auth } from '../services/auth';
import { forkJoin } from 'rxjs';

interface MonthlyData {
  year: number;
  month: number;
  totalAmount: number;
}

interface ConceptoData {
  concepto: string;
  total: number;
}

interface Transaction {
  id: number;
  concepto: { nombre: string };
  fecha: string;
  cantidad: number;
  tipo: { nombre: string };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  username: string = '';
  isAdmin: boolean = false;

  // Data properties
  currentBalance: number = 0;
  currentMonthIncome: number = 0;
  currentMonthExpenses: number = 0;
  currentMonthSavings: number = 0;

  monthlyExpenses: MonthlyData[] = [];
  monthlyIncome: MonthlyData[] = [];
  conceptoDistribution: ConceptoData[] = [];
  recentTransactions: Transaction[] = [];

  // Percentage
  incomePercentage: number = 0;
  expensesPercentage: number = 0;

  constructor(
    private router: Router,
    private finanzasService: FinanzasService,
    private authService: Auth,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    const user = this.authService.getUsername();
    if (user) {
      this.username = user;
    }
    this.isAdmin = this.authService.getRole() === 'ADMIN';

    if (this.isAdmin) {
      this.router.navigate(['/admin/finanzas']);
      return;
    }

    // Load data only if NOT admin
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load all data in parallel for better performance
    forkJoin({
      balance: this.finanzasService.getBalance(this.username),
      currentMonthIncome: this.finanzasService.getCurrentMonthIncome(this.username),
      currentMonthExpenses: this.finanzasService.getCurrentMonthExpenses(this.username),
      monthlyExpenses: this.finanzasService.getLast3MonthsExpenses(this.username),
      monthlyIncome: this.finanzasService.getLast3MonthsIncome(this.username),
      conceptoDistribution: this.finanzasService.getCategoryDistribution(this.username),
      recentTransactions: this.finanzasService.getRecentTransactions(this.username)
    }).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.currentBalance = data.balance || 0;
          this.currentMonthIncome = data.currentMonthIncome || 0;
          this.currentMonthExpenses = data.currentMonthExpenses || 0;
          this.monthlyExpenses = data.monthlyExpenses || [];
          this.monthlyIncome = data.monthlyIncome || [];
          this.conceptoDistribution = data.conceptoDistribution || [];
          this.recentTransactions = data.recentTransactions || [];

          this.calculatePercentages();
          this.calculateSavings();
          this.processChartData();

          // Force explicit detection as well just in case
          this.cd.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  calculatePercentages() {
    const total = this.currentMonthIncome + this.currentMonthExpenses;
    if (total > 0) {
      this.incomePercentage = (this.currentMonthIncome / total) * 100;
      this.expensesPercentage = (this.currentMonthExpenses / total) * 100;
    }
  }

  calculateSavings() {
    this.currentMonthSavings = this.currentMonthIncome - this.currentMonthExpenses;
  }

  getMonthName(month: number): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[month - 1] || '';
  }

  // Chart View Model
  chartData: { month: string, income: number, expense: number }[] = [];
  maxChartValue: number = 0;

  processChartData() {
    this.chartData = [];
    const monthsMap = new Map<number, { income: number, expense: number }>();

    // Process income
    this.monthlyIncome.forEach(d => {
      if (!monthsMap.has(d.month)) monthsMap.set(d.month, { income: 0, expense: 0 });
      monthsMap.get(d.month)!.income = d.totalAmount;
    });

    // Process expenses
    this.monthlyExpenses.forEach(d => {
      if (!monthsMap.has(d.month)) monthsMap.set(d.month, { income: 0, expense: 0 });
      monthsMap.get(d.month)!.expense = d.totalAmount;
    });

    // Sort by month (descending order based on current implementation logic, or adjusting to last 3 months)
    /* 
       The backend returns data sorted by year/month DESC. 
       We want to display the last 3 months.
    */
    const sortedMonths = Array.from(monthsMap.keys()).sort((a, b) => {
      // Simple sort for now, assuming same year. Ideally should consider year too.
      // But let's rely on the order provided by backend or just sort descending
      return b - a;
    });

    // Take top 3
    sortedMonths.slice(0, 3).forEach(month => {
      const data = monthsMap.get(month)!;
      this.chartData.push({
        month: this.getMonthName(month),
        income: data.income,
        expense: data.expense
      });
    });

    // Calculate Global Max
    const allValues = this.chartData.flatMap(d => [d.income, d.expense]);
    this.maxChartValue = Math.max(...allValues, 1); // Avoid division by zero
  }

  getBarHeight(amount: number): number {
    if (this.maxChartValue === 0) return 5;
    const percentage = (amount / this.maxChartValue) * 100;
    return Math.max(percentage, 5); // Minimum 5% height
  }

  getConceptoPercentage(concepto: ConceptoData): number {
    const total = this.conceptoDistribution.reduce((sum, cat) => sum + cat.total, 0);
    if (total === 0) return 0;
    return (concepto.total / total) * 100;
  }

  get topConceptos(): ConceptoData[] {
    return this.conceptoDistribution.slice(0, 3);
  }

  goToFinanzas() {
    this.router.navigate(['/admin/finanzas']);
  }

  goToNewTransaction() {
    this.router.navigate(['/admin/finanzas/new']);
  }
}
