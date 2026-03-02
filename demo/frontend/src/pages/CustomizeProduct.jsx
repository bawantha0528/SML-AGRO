import React, { useState } from "react";

const CustomizeProduct = () => {

  const [details, setDetails] = useState("");

  const handleSubmit = async () => {

    await fetch("http://localhost:8080/api/customization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customDetails: details })
    });

    alert("Customization request sent to admin!");
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Customize Your Product</h2>

      <div className="mb-3">
        <label className="form-label">
          Enter Desired Product Characteristics
        </label>

        <textarea
          className="form-control"
          rows="6"
          placeholder="Example: 5kg grow bag, 30x40cm, organic certified, EU export packaging..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <button
        className="btn btn-dark px-4"
        onClick={handleSubmit}
      >
        Submit to Admin
      </button>
    </div>
  );
};

export default CustomizeProduct;
