import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, signal } from '@angular/core';
import moment, { isMoment } from 'moment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SpaceStationComponent } from '../DUMMIES/space-station/space-station.component';
import { UtilsService } from '../../app/services/UtilsService';
import { DataInputService } from '../../app/services/DataInputService';

type queryParameters= { key: string, values: { type:string, caption:string, description: string, required: boolean, value:Array<string>}};
type agencyAPI = { apiName: string, endPoint: string, subTitle?:string, summary: string } ;
interface JsonObject {[key: string]: any;}
interface KVpair { key: string, value: string };
interface FieldAttributes  { FieldName: string, Caption: string, Type: string };;


@Component({
    selector: 'treasury-api',
    standalone: true,
    styleUrl: '../../3rdwind.css',
    templateUrl: 'TREASURY.component.html',
    imports: [CommonModule, SpaceStationComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TREASURYComponent {
  constructor( public sanitizer: DomSanitizer, public utils:UtilsService, public input:DataInputService){}
@ViewChild(SpaceStationComponent) dummy_SS!: SpaceStationComponent;
queryParameters : Array<queryParameters> = [];
agencyAPI : Array<agencyAPI> =[];
portalData: Array<any> = [];


ngOnInit(): void {
this.fieldNames = this.getAllFieldNames();
this.agencyAPI.push(
  {
    apiName: "Redemption Tables (RT)",
    endPoint: "/redemption_tables",
    summary: "The Accrual Savings Bonds Redemption Tables dataset contains monthly tables that list the redemption value, interest earned, and yield of accrual savings bonds. Accrual savings bonds included in the dataset were issued as far back as 1941. Each monthly report lists the redemption value of all bonds at the time of publication. Investors and bond owners can use this dataset as an easy and understandable reference to know the redemption value of the bonds they hold."
  });
    //!! Marker for new agencyAPI =======================================================================
this.agencyAPI.push(
  {
    apiName: "Advances to State Unemployment Funds (Social Security Act Title XII)",
    endPoint: "/title_xii",
    summary: "The Advances to State Unemployment Funds (Social Security Act Title XII) dataset shows how much states and territories are borrowing from the Unemployment Trust Fund in order to pay out unemployment benefits and the interest. This includes the state or territories' outstanding borrowing balance, amount they are authorized to borrow for the current month, current month borrowings, interest accrued for current fiscal year, and interest received."
  });
    //!! Marker for new agencyAPI =======================================================================



    this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "/avg_interest_rates",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });
        //!! Marker for new agencyAPI =======================================================================

        this.agencyAPI.push(
          {
            apiName: "Daily Treasury Statement",
            endPoint: `
            <table aria-label="Operating Cash Balance API Endpoints" style="width: auto;"><thead><tr><th scope="col" style="width: 25%;">Table Name</th><th scope="col" style="width: 25%;">Endpoint</th></tr></thead><tbody><tr><td class="">Operating Cash Balance</td><td class="">/v1/accounting/dts/operating_cash_balance</td></tr><tr><td class="">Deposits and Withdrawals of Operating Cash</td><td class="">/v1/accounting/dts/deposits_withdrawals_operating_cash</td></tr><tr><td class="">Public Debt Transactions</td><td class="">/v1/accounting/dts/public_debt_transactions</td></tr><tr><td class="">Adjustment of Public Debt Transactions to Cash Basis</td><td class="">/v1/accounting/dts/adjustment_public_debt_transactions_cash_basis</td></tr><tr><td class="">Debt Subject to Limit</td><td class="">/v1/accounting/dts/debt_subject_to_limit</td></tr><tr><td class="">Inter-Agency Tax Transfers</td><td class="">/v1/accounting/dts/inter_agency_tax_transfers</td></tr><tr><td class="">Income Tax Refunds Issued</td><td class="">/v1/accounting/dts/income_tax_refunds_issued</td></tr><tr><td class="">Federal Tax Deposits</td><td class="">/v1/accounting/dts/federal_tax_deposits</td></tr><tr><td class="">Short-Term Cash Investments</td><td class="">/v1/accounting/dts/short_term_cash_investments</td></tr></tbody></table>`,
            subTitle:"|This table represents the Treasury General Account balance. Additional detail on changes to the Treasury General Account can be found in the Deposits and Withdrawals of Operating Cash table. All figures are rounded to the nearest million.|This table represents deposits and withdrawals from the Treasury General Account. A summary of changes to the Treasury General Account can be found in the Operating Cash Balance table. All figures are rounded to the nearest million.|This table represents the issues and redemption of marketable and nonmarketable securities. All figures are rounded to the nearest million.|This table represents cash basis adjustments to the issues and redemptions of Treasury securities in the Public Debt Transactions table. All figures are rounded to the nearest million.|This table represents the breakdown of total public debt outstanding as it relates to the statutory debt limit. All figures are rounded to the nearest million.|This table represents the breakdown of taxes that are received by the federal government. Federal taxes received are represented as deposits in the Deposits and Withdrawals of Operating Cash table. All figures are rounded to the nearest million.|This table represents the amount Treasury has in short-term cash investments. Deposits and withdrawals of short-term cash investments are also represented in the Deposits and Withdrawals of Operating Cash table. This program was suspended indefinitely in 2008. All figures are rounded to the nearest million.|This table represents the breakdown of tax refunds by recipient (individual vs business) and type (check vs electronic funds transfer). Tax refunds are also represented as withdrawals in the Deposits and Withdrawals of Operating Cash table. All figures are rounded to the nearest million.",
            summary: "The Daily Treasury Statement (DTS) dataset contains a series of tables showing the daily cash and debt operations of the U.S. Treasury. The data includes operating cash balance, deposits and withdrawals of cash, public debt transactions, federal tax deposits, income tax refunds issued (by check and electronic funds transfer (EFT)), short-term cash investments, and issues and redemptions of securities. All figures are rounded to the nearest million."
          });
            //!! Marker for new agencyAPI =======================================================================


            this.agencyAPI.push(
              {
                apiName: "Debt to the Penny",
                endPoint: "/debt_to_penny",
                summary: "The Debt to the Penny dataset provides information about the total outstanding public debt and is reported each day. Debt to the Penny is made up of intragovernmental holdings and debt held by the public, including securities issued by the U.S. Treasury. Total public debt outstanding is composed of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities, as well as Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Debt to the Penny is updated at 3:00 PM EST each business day with data from the previous business day."
              });
                //!! Marker for new agencyAPI =======================================================================

                    this.agencyAPI.push(
                      {
                        apiName: "Interest on Uninvested Funds",
                        endPoint: "/interest_uninvested",
                        summary: "The Federal Borrowings Program: Interest on Uninvested Funds dataset provides quarterly interest balances associated with the Department of the Treasury (Treasury) Credit Reform: Interest Paid on Uninvested Funds account. This data includes the amount of interest payable and interest expense by department."
                      });
                        //!! Marker for new agencyAPI =======================================================================

    this.agencyAPI.push(
      {
        apiName: "Federal Credit Similar Maturity Rates",
        endPoint: "/federal_maturity_rates",
        summary: "The Federal Credit Similar Maturity Rates dataset provides the annual rates for outstanding fixed-rate Treasury securities, categorized on the basis of their remaining maturity.."
      });
        //!! Marker for new agencyAPI =======================================================================
         this.agencyAPI.push(
      {
        apiName: "Federal Investments Program: Interest Cost by Fund",
        endPoint: "/interest_cost_fund",
        summary: "The Federal Investments Program: Interest Cost by Fund dataset provides a summary of accounts within the Federal Investments Program including premiums, discounts, accrued interest collected, interest payments, and inflation compensation for all accounts invested in Government Account Series (GAS) Securities, as well as premium and discount amortization for accounts invested in zero-coupon bonds. Additionally, this dataset shows the Treasury Account Symbol (TAS) information for all accounts."
      });



      this.agencyAPI.push(
        {
          apiName: "Federal Investments Program: Statement of Account",
          endPoint: "fip_statement_of_account_table1",
          summary: "Federal Investments Program customers invested in Government Account Series (GAS) securities use the Statement of Account monthly detailed reports specifying the security holdings as of the end of each month and all transaction activity during that month for each individual investment account."
        });


        //!! Marker for new agencyAPI =======================================================================

         this.agencyAPI.push(
      {
        apiName: "Historical Debt Outstanding",
        endPoint: "/debt_outstanding",
        summary: "Historical Debt Outstanding is a dataset that provides a summary of the U.S. government's total outstanding debt at the end of each fiscal year from 1789 to the current year. Between 1789 and 1842, the fiscal year began in January. From January 1842 until 1977, the fiscal year began in July. From July 1977 onwards, the fiscal year has started in October. Between 1789 and 1919, debt outstanding was presented as of the first day of the next fiscal year. From 1920 onwards, debt outstanding has been presented as of the final day of the fiscal year. This is a high-level summary of historical public debt and does not contain a breakdown of the debt components. "
      });
        //!! Marker for new agencyAPI =======================================================================



         this.agencyAPI.push(
      {
        apiName: "Gift Contributions to Reduce the Public Debt",
        endPoint: "/gift_contributions",
        summary: "The Gift Contributions to Reduce the Public Debt dataset provides the monthly total for gift contributions received by the U.S. Treasury that were donated to reduce the public debt. These donations can include money, outstanding government obligations (such as savings bonds) and property that is sold for cash. Gifts may be classified as inter vivos (from a living person) or testamentary bequests (from a person's will)."
      });
        //!! Marker for new agencyAPI =======================================================================


         this.agencyAPI.push(
      {
        apiName: "Monthly Treasury Statement (MTS)",
        endPoint: `
        <table aria-label="Summary of Receipts, Outlays, and the Deficit/Surplus of the U.S. Government API Endpoints" style="width: auto;"><thead><tr><th scope="col" style="width: 25%;">Table Name</th><th scope="col" style="width: 25%;">Endpoint</th></tr></thead><tbody><tr><td class="">Summary of Receipts, Outlays, and the Deficit/Surplus of the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_1</td></tr><tr><td class="">Summary of Budget and Off-Budget Results and Financing of the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_2</td></tr><tr><td class="">Summary of Receipts and Outlays of the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_3</td></tr><tr><td class="">Receipts of the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_4</td></tr><tr><td class="">Outlays of the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_5</td></tr><tr><td class="">Means of Financing the Deficit or Disposition of Surplus by the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_6</td></tr><tr><td class="">Analysis of Change in Excess of Liabilities of the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_6a</td></tr><tr><td class="">Securities Issued by Federal Agencies Under Special Financing Authorities</td><td class="">/v1/accounting/mts/mts_table_6b</td></tr><tr><td class="">Federal Agency Borrowing Financed Through the Issue of Treasury Securities</td><td class="">/v1/accounting/mts/mts_table_6c</td></tr><tr><td class="">Investments of Federal Government Accounts in Federal Securities</td><td class="">/v1/accounting/mts/mts_table_6d</td></tr><tr><td class="">Guaranteed and Direct Loan Financing, Net Activity</td><td class="">/v1/accounting/mts/mts_table_6e</td></tr><tr><td class="">Receipts and Outlays of the U.S. Government by Month</td><td class="">/v1/accounting/mts/mts_table_7</td></tr><tr><td class="">Trust Fund Impact on Budget Results and Investment Holdings</td><td class="">/v1/accounting/mts/mts_table_8</td></tr><tr><td class="">Summary of Receipts by Source, and Outlays by Function of the U.S. Government</td><td class="">/v1/accounting/mts/mts_table_9</td></tr></tbody></table>`,
        summary: "The Monthly Treasury Statement (MTS) dataset provides information on the flow of money into and out of the U.S. Department of the Treasury. It includes how deficits are funded, such as borrowing from the public or reducing operating cash, and how surpluses are distributed. Further tables categorize spending (outlays) by department and agency, revenue (receipts) by specific taxes or other government sources of income, and transactions with trust funds such as Social Security or Medicare. All values are reported in millions of U.S. dollars."
      });
        //!! Marker for new agencyAPI =======================================================================


         this.agencyAPI.push(
      {
        apiName: "Summary General Ledger Balances Report",
        endPoint: `
        <table aria-label="Summary General Ledger Borrowing Balances API Endpoints" style="width: auto;"><thead><tr><th scope="col" style="width: 25%;">Table Name</th><th scope="col" style="width: 25%;">Endpoint</th></tr></thead><tbody><tr><td class="">Summary General Ledger Borrowing Balances</td><td class="">/v1/accounting/od/fbp_gl_borrowing_balances</td></tr><tr><td class="">Summary General Ledger Repayable Advance Balances</td><td class="">/v1/accounting/od/fbp_gl_repay_advance_balances</td></tr></tbody></table>`,
        summary: "The Federal Borrowings Program: Summary General Ledger Balances Report dataset provides Treasury Loans Receivable, Capitalized Interest Receivable, Interest Receivable, Interest Revenue, Gain, and Loss balances associated with every corresponding borrowing agency expenditure Treasury Account Symbol."
      });

      this.agencyAPI.push(
        {
          apiName: " Interest on Uninvested Funds",
          endPoint: "/interest_uninvested",
          summary: "The Federal Borrowings Program: Interest on Uninvested Funds dataset provides quarterly interest balances associated with the Department of the Treasury (Treasury) Credit Reform: Interest Paid on Uninvested Funds account. This data includes the amount of interest payable and interest expense by department."
        });


        //!! Marke

         this.agencyAPI.push(
      {
        apiName: "Financial Report of the U.S. Government",
        endPoint: `
        <table aria-label="Statements of Net Cost API Endpoints" style="width: auto;"><thead><tr><th scope="col" style="width: 25%;">Table Name</th><th scope="col" style="width: 25%;">Endpoint</th></tr></thead><tbody><tr><td class="">Statements of Net Cost</td><td class="">/v2/accounting/od/statement_net_cost</td></tr><tr><td class="">Statements of Operations and Changes in Net Position</td><td class="">/v1/accounting/od/net_position</td></tr><tr><td class="">Reconciliations of Net Operating Cost and Budget Deficit</td><td class="">/v1/accounting/od/reconciliations</td></tr><tr><td class="">Statements of Changes in Cash Balance from Budget and Other Activities</td><td class="">/v1/accounting/od/cash_balance</td></tr><tr><td class="">Balance Sheets</td><td class="">/v2/accounting/od/balance_sheets</td></tr><tr><td class="">Statements of Long-Term Fiscal Projections</td><td class="">/v1/accounting/od/long_term_projections</td></tr><tr><td class="">Statements of Social Insurance</td><td class="">/v1/accounting/od/social_insurance</td></tr><tr><td class="">Statements of Changes in Social Insurance Amounts</td><td class="">/v1/accounting/od/insurance_amounts</td></tr></tbody></table>`,
        summary: "The Financial Report of the U.S. Government presents the federal government’s financial position and condition, including its financial activity and results, for each fiscal year. It provides a comprehensive view of the federal government’s finances, accounting for its revenues and costs, assets and liabilities, and other obligations and commitments. The Financial Report dataset has a table for each of the consolidated financial statements of the U.S. government, which are prepared using GAAP (Generally Accepted Accounting Principles). Detailed descriptions of each statement can be found in the Data Tables tab on this page. Each year’s Financial Report also includes restatements of the previous fiscal year’s figures, enabling users to connect prior year ending balances with current year starting balances. The Financial Report is produced by Treasury in coordination with OMB, which is part of the Executive Office of the President. The Secretary of the Treasury, the Director of OMB, and the Comptroller General of the U.S. at the GAO believe that the information discussed in the Financial Report is important to all Americans."
      });

         this.agencyAPI.push(
      {
        apiName: "Receipts by Department",
        endPoint: "/receipts_by_department",
        summary: "The Receipts by Department dataset is part of the Combined Statement of Receipts, Outlays, and Balances published by the Bureau of the Fiscal Service at the end of each fiscal year. The Combined Statement is recognized as the official publication of receipts and outlays. This dataset contains department receipt amounts broken out by type, account, and line item."
      });


      //    this.agencyAPI.push(
      // {
      //   apiName: "Interest Expense on the Public Debt Outstanding",
      //   endPoint: "/interest_expense",
      //   summary: "The Interest Expense on the Public Debt Outstanding dataset provides monthly and fiscal year-to-date values for interest expenses on federal government debt, that is, the cost to the U.S. for borrowing money (calculated at a specified rate and period of time). U.S. debt includes Treasury notes and bonds, foreign and domestic series certificates of indebtedness, savings bonds, Government Account Series (GAS), State and Local Government Series (SLGS) and other special purpose securities. While interest expenses are what the government pays to investors who loan money to the government, how much the government pays in interest depends on both the total federal debt and the interest rate investors charged when they loaned the money. This dataset is useful for those who wish to track the cost of maintaining federal debt."
      // });
/*
====================================================
=================================================



         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });

         this.agencyAPI.push(
      {
        apiName: "Average Interest Rates",
        endPoint: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od",
        summary: "The Average Interest Rates on U.S. Treasury Securities dataset provides average interest rates on U.S. Treasury securities on a monthly basis. Its primary purpose is to show the average interest rate on a vaAverageriety of marketable and non-marketable Treasury securities. Marketable securities consist of Treasury Bills, Notes, Bonds, Treasury Inflation-Protected Securities (TIPS), Floating Rate Notes (FRNs), and Federal Financing Bank (FFB) securities. Non-marketable securities consist of Domestic Series, Foreign Series, State and Local Government Series (SLGS), U.S. Savings Securities, and Government Account Series (GAS) securities. Marketable securities are negotiable and transferable and may be sold on the secondary market. Non-marketable securities are not negotiable or transferrable and are not sold on the secondary market. This is a useful dataset for investors and bond holders to compare how interest rates on Treasury securities have changed over time."
      });r for new agencyAPI =======================================================================


============================================
*/




    this.queryParameters = [
      { key:"fields",
        values:{
          type: "fields",
          caption: "Field List",
          description: "Field parameter accepts a comma separated list of field names that the user wants to be returned in the response.",
          required: true,
          value: []}},
    { key:"filter",
      values:{
        type: this.FilterChoices,
        caption: "Select Field/s|Filter",
        description: "Filter is used to apply logic criteria to each field if necessary (lt, gt, lte, gte, eq, in).",
        required: true,
        value: [] }},
    { key:"sort",
      values:{
        type: this.SortChoices,
        caption:"Select Field/s|Sort" ,
        description: "Sorting parameter accepts a comma separated list of field names that the user wants to sort the response by.",
        required: true,
        value: [] }},
    { key:"format",
      values:{
        type: "JSON|json,XML|xml,CSV|csv",
        caption: "Response Format",
        description: "Format is used to define how output method for the response (json, xml, csv).",
        required: true,
        value: [] }},
    { key:"page[size]",
      values:{
      type: '100',
      caption: "Page Size",
      description: "Page size will set the number of rows returned on a request.",
      required: true,
      value: [] }},
    { key:"page[number]",
      values:{
      type: "1",
      caption: "Page Number",
      description: "Page number will set the index for the pagination.",
      required: true,
      value: []}}];
  }




DataFormats: any ={
  "account_name": "'text'",
  "account_number_tas": "'text'",
  "date_range": "'text'",
  "interest_inflation_earnings": "'number' min='0' step='.01'",
  "memo_no": "'text'",
  "premium_discount_recognized": "'number' min='0' step='.01'",
  "principal_inflation_comp": "'number' min='0' step='.01'",
  "record_calendar_day": "min='1' max='31'",
  "record_calendar_month": "min='1' max='12'",
  "record_calendar_quarter": "min='1' max='4'",
  "record_calendar_year": "min='1980' max='2024'",
  "record_date": "'date' value='YYYY-MM-DD'",
  "record_fiscal_quarter": "min='1' max='4'",
  "record_fiscal_year": "min='1980' max='2024'",
  "src_line_nbr": "min='1' max='9999'",
  "sub_category": "'text'",
  "total_inflation_purchased_sold": "'number' min='0' step='.01'",
  "total_investments": "'number' min='0' step='.01'",
  "total_redemptions": "'number' min='0' step='.01'",
  "trans_date": "'date' value='YYYY-MM-DD'",
  "unrealized_discount": "'number' min='0' step='.01'"
}



FilterChoices = "Less Than|lt,Greater Than|gt,Less Than or Equal|lte,Greater Than or Equal|gte,Equal|eq,In|in";
SortChoices = "Ascending|asc,Descending|desc";
sortSelector: string  ="";
filterSelector: string  ="";
dropdownID =1;

useFloater( floaterValue: {title:string, body: string, footer: string}){
        let ID = "DYNAMIC_ID"
        let OperationLabel="Add"
        if(!floaterValue.title.includes("<TITLE_HOLDER>")){
          this.dropdownID++;
          ID=`dropdown${this.dropdownID}`;
          OperationLabel = "Submit"
        }
        let floater =`
        <floater class='grid w-full p-0 drop-shadow-xl dropdownContent'>
          <h3 class='w-full m-0 p-0 rounded-t-md text-center bg-zinc-600 text-stone-50 text-wrap'>${floaterValue.title.toUpperCase()}</h3>
          <button class='btn btn-sm btn-warning absolute top-2 right-2 btn-circle' onclick='(${ID}.click())'>x</button>
          <floater-body class='grid'>${floaterValue.body}</floater-body>
          <floater-footer id='footerBlock${ID}' class='hidden'><hr>
          <div id='selectedfields' class=' ml-4 text-wrap font-light text-sm'></div>
          ${floaterValue.footer}
          <div id='submitBlock${ID}' class='absolute hidden bottom-1 right-2'>
          <button class='btn btn-sm btn-warning m-1' onclick='_cancelEnableSubmit("${ID}")'>Reset</button>
          <button class='btn btn-sm btn-warning' id="operation${ID}" onclick="_OperationSubmit('${ID}')">${OperationLabel}</button>
          </div>
          </floater-footer>
        </floater>
        `
        floater = `<details class='dropdown  max-w-[80%]'><summary id='${ID}' class='mx-1 p-0 text-white min-w-32 btn btn-sm '>
        </summary>${floater}</details>`;
        return floater;
}


convertToFloaterBody(fieldName:string, obj:Array<FieldAttributes | string> ,   isMultiple:string=""){
  let result = "";
  let actionValues = ""
  const rnd = "";// Math.floor(Math.random() * 1000000);
  obj.forEach((item: FieldAttributes | string ) => {
        const ID = (typeof item === "string" ? item.split("|")[1] : item.FieldName) + rnd;
        let mode = isMultiple;
        if(isMultiple==="M") {  mode = (this.dropdownID + 1)+""};
        result +=  `<label class='flex min-w-[300px] w-full item-selector mx-2'
                    onclick='_getSelectedInputValues("${ID}","${mode}")'>`;
        if(isMultiple==="M"){
              result+=`<input type='checkbox' class='mr-3 multi-list'>`;
        }
          const caption = (typeof item === "string" ? item.split("|")[0] : item.Caption);
          result+= `<div class='labelGroup${mode}' id='label${ID}${mode}'> ${caption} </div></label>`;
    });
  return result;
}


inputSmartSelect(fieldName:string, obj: string[], isMultiple:string=""): string {
          if(fieldName.includes("Select Field/s")) {
                const action = fieldName.split("|")[1] ;
                let title= `${action} By Field`.toUpperCase();
                this.dropdownID++;
                let footer=``;
                const choices= ( action==='Sort'? this.SortChoices : this.FilterChoices).split(",");
                if(action==="Filter") {
                      footer += `<div id='${action}Container' class='flex'><div class='grid'>${this.convertToFloaterBody(action,choices,action+"Choice")}</div>
                        <div class='grid'><div class='grid hover:scale-125 align-top rounded-box p-2 bg-pink-50 drop-shadow-md'>
                          <div id='${action}Value'>&nbsp;</div><div id='${action}Choice'></div>
                          <input class='rounded-none' type="text" id='${action}EntryChoice' onchange="_enableSubmit('${action}',this.value)" onkeyup="_enableSubmit('${action}',this.value)">
                        </div>
                        <code class='grid w-full min-w-full text-right' id="selected${action}"></code>
                      </div></div>`;
                }
                else footer  += `<div id='${action}Container' class='flex gap-4'><div class='grid min-w-48 text-xl text-red-600' id='SortValue'></div> ${this.convertToFloaterBody(action, choices,action+"Choice")}</div>`;
                let body = this.chooseFieldsBody.replaceAll("DYNAMIC_ID", action ).replaceAll("XXXXX", action);
                return body.replace("<TITLE_HOLDER>", title).replace("<FOOTER_HOLDER>",footer);
          }
                let body = this.convertToFloaterBody(fieldName, obj, isMultiple);
                const floatContent = (isMultiple==="M") ? `<div class='w-full md:columns-1 lg:columns-2'>${body}</div>` : body;
                let floater = { title: fieldName, body: floatContent, footer:'' };
                if(isMultiple=="M" ) {
                      floater.title = fieldName + ` (Multi-Select)`;
                      const footer = `<hr><div class='mt-4 h-8 w-full justify-end'><button id='_multi${fieldName}' class='btn-info btn-sm '
                      onclick='_mutiSelectAll("${fieldName}")'>Select All</button></div>`;
                      floater.footer = footer;
                      if(fieldName==="fields")
                        {
                          body = this.convertToFloaterBody(fieldName, obj, "XXXXX");
                          body = `<div class='w-full md:columns-1 lg:columns-2'>${body}</div>`;
                          this.chooseFieldsBody = this.useFloater({ title:"<TITLE_HOLDER>", body: body, footer:"<FOOTER_HOLDER>" });
                        }
                }

  return this.useFloater( floater);
}


chooseFieldsBody=""


createSmartWidget = ( urlFields: Array<any>, parameters: Array<any>, widget: Array<any>) =>{
    for(let urlItem of urlFields){
        const keyURL = urlItem.key;
        const URLFields  = urlItem.values;
          let result ="<table class='overflow-visible'>";
          for(let item of parameters){
          const x = item.values;
          let InputString: string ="";
          let inputItem = x.type
          const id=item.key;
                if(id==="sort") inputItem="Ascending|Asc,Descending|Desc";
                if(!isNaN(parseInt(inputItem))) InputString = `<input type='numeric' value='${inputItem}' id='${id}'>`
                else if(inputItem=="fields") InputString = this.inputSmartSelect( id, URLFields ,"M")
                else if(id=="filter" || id=="sort" || id=="format") InputString =  this.inputSmartSelect( x.caption,inputItem.split(',') )
                else
                InputString = `<input type='text'  id='${id}'>`
          result += `<tr class='h-16'><td class='w-42 font-extrabold'>${x.caption.replace('Select Field/s|','')}</td><td class='w-[200px]'>${InputString}</td><td class='w-full'>${x.description}</td></tr>`
          }
          widget.push({ widgetName: keyURL, widget: result + `</table>` });
    }
}


getAllFieldNames(): Array<string>{
    let result:Array<string> = [];
    Object.keys(this.DataFormats).forEach((item)=> result.push(item))
    return result ;
}

getAllFieldLabels(): Array<string>{
  let result:Array<string> = [];
  Object.values(this.DataLabels).forEach((item)=> result.push(item))
  return result ;
}

getFieldLabel(field: string){
    const obj = Object.entries(this.DataLabels);
    const result: any = obj.find( (item: any) => item[0]===field);
    return result[1];
}

getFieldName(caption: string){
  const obj = Object.entries(this.DataLabels);
  const result: any = obj.find( (item:any) => item[1]==caption);
  return result[0];
}

getFieldInput(field: string){
    const obj = Object.entries(this.DataFormats);
    const result: any = obj.find( (item: any)=> item[0]==field);
    return result[1];
}
DataLabels: object  = {
  "account_name": "Account Name",
  "account_number_tas": "Account Number",
  "date_range": "Date Range",
  "interest_inflation_earnings": "Interest Inflation Earnings",
  "memo_no": "Memo Number",
  "premium_discount_recognized": "Premium Discount Recognized",
  "principal_inflation_comp": "Principal Inflation Compensation",
  "record_calendar_day": "Calendar Day Number",
  "record_calendar_month": "Calendar Month Number",
  "record_calendar_quarter": "Calendar Quarter Number",
  "record_calendar_year": "Calendar Year",
  "record_date": "Record Date",
  "record_fiscal_quarter": "Fiscal Quarter Number",
  "record_fiscal_year": "Fiscal Year",
  "src_line_nbr": "Source Line Number",
  "sub_category": "Sub Category",
  "total_inflation_purchased_sold": "Total Inflation Purchased Sold",
  "total_investments": "Total Investments",
  "total_redemptions": "Total Redemptions",
  "trans_date": "Transaction Date",
  "unrealized_discount": "Unrealized Discount"
}




async powerUpPortal( widget:any){
  this.portalData = [];
  let result ="";
  let s=""
  try{
          for(let api of this.agencyAPI) {
            const name = api.apiName;
            const endPoint = api.endPoint;
            s = endPoint + "\n" + name;
            if(endPoint.includes("<table")) {
              result=endPoint.replaceAll(`<td class="">`, "<td>").replaceAll(`style="width: 25%;"`, '');
              result=result.replaceAll(`/v`, `||| class='btn-warning btn-sm' onclick="_setURL('/v`);
              result = result.replaceAll("|||", "<button ").replaceAll("</td></tr>", `')">...</button></td></tr>`);
            }
            else result = `<button class='absolute right-4 top-56 btn-warning' onclick="_setURL('${endPoint}',1)">FETCH ${endPoint}</button>`;
                  const currentWidget = await widget.find( (item:any) => this.verifyEndPoint(endPoint)===item.widgetName).widget
                  this.portalData.push( { key: api.apiName.split("|")[0], vault: api.endPoint,
                                      values: { info: {title: api.apiName.split("|")[0], description: api.summary}, tags:"",
                              expo: currentWidget + "<hr>" +  result  }});
          }
          this.dummy_SS.portal = this.portalData;

  }
  catch(err){
          // console.log(err);
          //  alert(err + "\n\n"+ s +"\n" + result)
  }

}


verifyEndPoint(endPoint: string){
  if(endPoint.includes("<table")) {
    const temp="/" + endPoint.split(`<td class="">/`)[1];
    endPoint= temp.split("</td></tr>")[0];
  }
  return endPoint
}

globalResult ="";


fieldNames: Array<string> = [];
multiSelectFields:{ key: string, value: any }[] = [];
widgetData: { widgetName: string, widget: string }[] = [];

  async ngAfterViewInit(): Promise<void> {
  for(let api of this.agencyAPI) {
    const name = api.apiName;
    let  endPoint = api.endPoint;
    await this.input.getChoicesFields(this.verifyEndPoint(endPoint),this.multiSelectFields, 1);
  }
  //  const widget = this.createSmartWidget( this.queryParameters );
  this.createSmartWidget(this.multiSelectFields, this.queryParameters, this.widgetData);
  await this.powerUpPortal( this.widgetData);
  this.dummy_SS.PortalReadyMessage.set("BON VOYAGE");
}







}
function smartSelect(fieldName: any, string: any, isMultiple: any, arg3: boolean) {
  throw new Error('Function not implemented.');
}

