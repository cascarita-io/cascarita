import React from "react";
import FormHeader from "../../components/FormHeader/FormHeader";
import FormFooter from "../../components/FormFooter/FormFooter";
import GreenCheckMarkIcon from "../../assets/Icons/GreenCheckMarkIcon";

const ThankYou: React.FC = () => {
  return (
    <>
      <FormHeader />
      <div
        style={{
          fontFamily: "Roboto, sans-serif",
          textAlign: "center",
          fontSize: "18px",
          lineHeight: "24px",
          margin: "0 auto",
          maxWidth: "480px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "152px",
              height: "152px",
            }}
          ></div>
        </div>

        <p>
          <strong>Fantastic!</strong>
        </p>

        <p>Your form has been successfully submitted.</p>
        <div
          style={{
            paddingTop: "50px",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <GreenCheckMarkIcon />
        </div>
      </div>

      <FormFooter />
    </>
  );
};

export default ThankYou;
