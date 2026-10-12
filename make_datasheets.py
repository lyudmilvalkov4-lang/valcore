from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


out = Path("assets/datasheets")
out.mkdir(parents=True, exist_ok=True)
logo_image = Path("assets/valkov-logo-web.png")

grades = {
    "pg-64-22-datasheet.pdf": {
        "grade": "PG 64-22",
        "description": "General paving binder for standard traffic and regional climate requirements.",
        "rows": [
            ("Average 7-day maximum pavement design temperature", "deg C", "<64", "62.8", ""),
            ("Minimum pavement design temperature", "deg C", ">-22", "-22", ""),
            ("Flash Point", "deg C", "Min. 230", "314", "AASHTO T48"),
            ("Viscosity @135 deg C", "Pa.s", "Max. 3.0", "0.62", "AASHTO T316"),
            ("Dynamic Shear, original binder at 64 deg C", "kPa", "Min. 1.0", "1.46", "AASHTO T315"),
            ("Mass change, RTFO residue", "%Wt", "Max. 1.0", "0.18", "AASHTO T240"),
            ("Dynamic Shear, RTFO residue at 64 deg C", "kPa", "Min. 2.2", "2.82", "AASHTO T315"),
            ("PAV Temperature", "deg C", "100", "100", "AASHTO R28"),
            ("Dynamic Shear, PAV residue at 25 deg C", "kPa", "Max. 5000", "2840", "AASHTO T315"),
            ("Creep Stiffness, S value", "MPa", "Max. 300", "146", "AASHTO T313"),
            ("Creep Stiffness, M value", "", "Min. 0.30", "0.36", "AASHTO T313"),
            ("Direct Tension failure strain", "%", "Min. 1.0", "3.2", "AASHTO T314"),
        ],
    },
    "pg-70-22-datasheet.pdf": {
        "grade": "PG 70-22",
        "description": "Enhanced high-temperature performance for heavier traffic and tougher service conditions.",
        "rows": [
            ("Average 7-day maximum pavement design temperature", "deg C", "<70", "68.9", ""),
            ("Minimum pavement design temperature", "deg C", ">-22", "-22", ""),
            ("Flash Point", "deg C", "Min. 230", "318", "AASHTO T48"),
            ("Viscosity @135 deg C", "Pa.s", "Max. 3.0", "0.78", "AASHTO T316"),
            ("Dynamic Shear, original binder at 70 deg C", "kPa", "Min. 1.0", "1.38", "AASHTO T315"),
            ("Mass change, RTFO residue", "%Wt", "Max. 1.0", "0.21", "AASHTO T240"),
            ("Dynamic Shear, RTFO residue at 70 deg C", "kPa", "Min. 2.2", "2.67", "AASHTO T315"),
            ("PAV Temperature", "deg C", "100", "100", "AASHTO R28"),
            ("Dynamic Shear, PAV residue at 28 deg C", "kPa", "Max. 5000", "3180", "AASHTO T315"),
            ("Creep Stiffness, S value", "MPa", "Max. 300", "168", "AASHTO T313"),
            ("Creep Stiffness, M value", "", "Min. 0.30", "0.34", "AASHTO T313"),
            ("Direct Tension failure strain", "%", "Min. 1.0", "2.8", "AASHTO T314"),
        ],
    },
    "pg-76-22-datasheet.pdf": {
        "grade": "PG 76-22",
        "description": "Polymer modified binder for premium rutting resistance and demanding pavement sections.",
        "rows": [
            ("Average 7-day maximum pavement design temperature", "deg C", "<76", "74.6", ""),
            ("Minimum pavement design temperature", "deg C", ">-22", "-22", ""),
            ("Flash Point", "deg C", "Min. 230", "320", "AASHTO T48"),
            ("Viscosity @135 deg C", "Pa.s", "Max. 3.0", "1.12", "AASHTO T316"),
            ("Dynamic Shear, original binder at 76 deg C", "kPa", "Min. 1.0", "1.31", "AASHTO T315"),
            ("Mass change, RTFO residue", "%Wt", "Max. 1.0", "0.24", "AASHTO T240"),
            ("Dynamic Shear, RTFO residue at 76 deg C", "kPa", "Min. 2.2", "2.51", "AASHTO T315"),
            ("PAV Temperature", "deg C", "100", "100", "AASHTO R28"),
            ("Dynamic Shear, PAV residue at 31 deg C", "kPa", "Max. 5000", "3550", "AASHTO T315"),
            ("Creep Stiffness, S value", "MPa", "Max. 300", "185", "AASHTO T313"),
            ("Creep Stiffness, M value", "", "Min. 0.30", "0.33", "AASHTO T313"),
            ("Direct Tension failure strain", "%", "Min. 1.0", "2.4", "AASHTO T314"),
        ],
    },
}

for filename, data in grades.items():
    grade = data["grade"]
    description = data["description"]
    rows = data["rows"]
    pdf = canvas.Canvas(str(out / filename), pagesize=letter)
    width, height = letter
    pdf.setFillColor(colors.white)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)
    if logo_image.exists():
        pdf.drawImage(
            str(logo_image),
            0.58 * inch,
            height - 1.23 * inch,
            width=0.78 * inch,
            height=0.78 * inch,
            mask="auto",
        )
    pdf.setFillColor(colors.HexColor("#08213f"))
    pdf.setFont("Helvetica-Bold", 24)
    pdf.drawString(1.72 * inch, height - 0.72 * inch, f"Valkov {grade}")
    pdf.setFont("Helvetica", 10.5)
    pdf.drawString(1.72 * inch, height - 0.98 * inch, "Product Data Sheet | Polymer Modified Asphalt Binder")
    pdf.setStrokeColor(colors.HexColor("#d7ecff"))
    pdf.setLineWidth(1)
    pdf.line(0.65 * inch, height - 1.22 * inch, 7.85 * inch, height - 1.22 * inch)

    y = height - 1.62 * inch
    pdf.setFillColor(colors.HexColor("#08213f"))
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(0.7 * inch, y, "Applications")
    pdf.setFont("Helvetica", 10)
    pdf.drawString(0.7 * inch, y - 0.25 * inch, description)

    y -= 0.75 * inch
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(0.7 * inch, y, "Specification Summary")
    y -= 0.28 * inch
    pdf.setFont("Helvetica-Bold", 8.5)
    columns = [0.7 * inch, 3.55 * inch, 4.22 * inch, 5.12 * inch, 6.16 * inch]
    pdf.setFillColor(colors.HexColor("#f8fbff"))
    pdf.rect(0.65 * inch, y - 0.07 * inch, 7.2 * inch, 0.24 * inch, fill=1, stroke=0)
    pdf.setFillColor(colors.HexColor("#08213f"))
    for x, header in zip(columns, ["Characteristics", "Unit", "Limits", "Actual Result", "Test Methods"]):
        pdf.drawString(x, y, header)
    y -= 0.15 * inch
    pdf.line(0.7 * inch, y, 7.7 * inch, y)
    y -= 0.22 * inch
    pdf.setFont("Helvetica", 7.6)
    for index, row in enumerate(rows):
        if index % 2:
            pdf.setFillColor(colors.HexColor("#f8fbff"))
            pdf.rect(0.65 * inch, y - 0.07 * inch, 7.2 * inch, 0.2 * inch, fill=1, stroke=0)
        pdf.setFillColor(colors.HexColor("#08213f"))
        for x, value in zip(columns, row):
            pdf.drawString(x, y, value)
        y -= 0.24 * inch

    y -= 0.18 * inch
    pdf.setFont("Helvetica", 8)
    pdf.drawString(0.7 * inch, y, "Actual results shown are representative batch-result values and may be replaced by certified COA values for each shipment.")
    pdf.setStrokeColor(colors.HexColor("#d7ecff"))
    pdf.line(0.65 * inch, 0.85 * inch, 7.85 * inch, 0.85 * inch)
    pdf.setFillColor(colors.HexColor("#4b6681"))
    pdf.drawString(0.7 * inch, 0.6 * inch, "Valkov | Origin Baltimore Terminals | Baltimore, MD")
    pdf.save()
