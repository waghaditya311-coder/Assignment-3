import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/calculateBill")
public class ElectricityBillServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Read form parameters
        String consumerName = request.getParameter("consumerName");
        String consumerNo = request.getParameter("consumerNo");
        String meterNo = request.getParameter("meterNo");
        int prevReading = Integer.parseInt(request.getParameter("prevReading"));
        int currReading = Integer.parseInt(request.getParameter("currReading"));
        String category = request.getParameter("category");
        String billMonth = request.getParameter("billMonth");

        int units = currReading - prevReading;

        // Calculate energy charge based on category and slabs
        double energyCharge = calculateEnergyCharge(units, category);
        double fixedCharge = getFixedCharge(category);
        double electricityDuty = energyCharge * 0.10;
        double fuelSurcharge = energyCharge * 0.02;
        double totalAmount = energyCharge + fixedCharge + electricityDuty + fuelSurcharge;

        // Generate HTML response
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("  <meta charset='UTF-8'>");
        out.println("  <title>Electricity Bill - " + consumerName + "</title>");
        out.println("  <style>");
        out.println("    body { font-family: 'Inter', sans-serif; background: #060b17; color: #f1f5f9; padding: 40px; }");
        out.println("    .bill-card { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 20px; padding: 32px; }");
        out.println("    .bill-title { text-align: center; font-size: 1.5rem; color: #6366f1; margin-bottom: 24px; }");
        out.println("    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }");
        out.println("    .total { font-size: 1.3rem; font-weight: 700; color: #10b981; border: none; padding-top: 16px; }");
        out.println("  </style>");
        out.println("</head><body>");
        out.println("  <div class='bill-card'>");
        out.println("    <div class='bill-title'>⚡ Electricity Bill</div>");
        out.println("    <div class='row'><span>Consumer Name</span><span>" + consumerName + "</span></div>");
        out.println("    <div class='row'><span>Consumer No.</span><span>" + consumerNo + "</span></div>");
        out.println("    <div class='row'><span>Meter No.</span><span>" + meterNo + "</span></div>");
        out.println("    <div class='row'><span>Billing Month</span><span>" + billMonth + "</span></div>");
        out.println("    <div class='row'><span>Category</span><span>" + category + "</span></div>");
        out.println("    <div class='row'><span>Previous Reading</span><span>" + prevReading + " kWh</span></div>");
        out.println("    <div class='row'><span>Current Reading</span><span>" + currReading + " kWh</span></div>");
        out.println("    <div class='row' style='color:#f59e0b;font-weight:600'><span>Units Consumed</span><span>" + units + " kWh</span></div>");
        out.println("    <hr style='border-color:rgba(255,255,255,0.1);margin:12px 0'>");
        out.println("    <div class='row'><span>Energy Charge</span><span>₹" + String.format("%.2f", energyCharge) + "</span></div>");
        out.println("    <div class='row'><span>Fixed Charge</span><span>₹" + String.format("%.2f", fixedCharge) + "</span></div>");
        out.println("    <div class='row'><span>Electricity Duty (10%)</span><span>₹" + String.format("%.2f", electricityDuty) + "</span></div>");
        out.println("    <div class='row'><span>Fuel Surcharge (2%)</span><span>₹" + String.format("%.2f", fuelSurcharge) + "</span></div>");
        out.println("    <div class='row total'><span>Total Payable</span><span>₹" + String.format("%.2f", totalAmount) + "</span></div>");
        out.println("  </div>");
        out.println("</body></html>");
    }

    private double calculateEnergyCharge(int units, String category) {
        switch (category) {
            case "residential":
                return calcResidentialSlab(units);
            case "commercial":
                return units * 8.00;
            case "industrial":
                return units * 7.50;
            default:
                return calcResidentialSlab(units);
        }
    }

    private double calcResidentialSlab(int units) {
        double charge = 0;
        if (units <= 100) {
            charge = units * 3.50;
        } else if (units <= 300) {
            charge = 100 * 3.50 + (units - 100) * 5.50;
        } else if (units <= 500) {
            charge = 100 * 3.50 + 200 * 5.50 + (units - 300) * 7.00;
        } else {
            charge = 100 * 3.50 + 200 * 5.50 + 200 * 7.00 + (units - 500) * 8.50;
        }
        return charge;
    }

    private double getFixedCharge(String category) {
        switch (category) {
            case "residential": return 50.0;
            case "commercial": return 200.0;
            case "industrial": return 350.0;
            default: return 50.0;
        }
    }
}
