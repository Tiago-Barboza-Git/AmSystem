import { Dispatch, SetStateAction } from "react";
import { Step, Stepper } from "react-form-stepper";

interface stepperCustomVendaProps {
  permissionNext: boolean;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  labels: string[];
  className?: string;
}

function StepperVendaCustom({ permissionNext, activeStep, setActiveStep, labels, className }: stepperCustomVendaProps) {
  return (
    <Stepper activeStep={activeStep} className={className}>
      <Step
        className="!bg-green-400"
        onClick={() => {
          setActiveStep(0);
        }}
        label={labels[0]}
      />
      <Step
        className={`${
          activeStep == 1 || activeStep == 2 || activeStep == 3 || activeStep == 4 ? "!bg-green-400" : "!bg-gray-400"
        }`}
        disabled={false}
        onClick={() => {
          setActiveStep(1);
        }}
        label={labels[1]}
      />
      <Step
        className={`${activeStep == 2 || activeStep == 3 || activeStep == 4 ? "!bg-green-400" : "!bg-gray-400"}`}
        disabled={false}
        onClick={() => {
          setActiveStep(2);
        }}
        label={labels[2]}
      />
      <Step
        className={`${activeStep == 3 || activeStep == 4 ? "!bg-green-400" : "!bg-gray-400"}`}
        disabled={false}
        onClick={() => {
          setActiveStep(3);
        }}
        label={labels[3]}
      />
    </Stepper>
  );
}

export default StepperVendaCustom;
