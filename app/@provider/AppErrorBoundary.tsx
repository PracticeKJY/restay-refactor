// src/app/providers/AppErrorBoundary.tsx
import type { ReactNode, CSSProperties } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { ErrorBoundaryIcon } from "@shared/icons/ErrorBoundaryIcon";
// import { useTranslation } from "react-i18next";

interface FallbackProps {
  readonly error: Error;
  readonly resetErrorBoundary: () => void;
}

interface AppErrorBoundaryProps {
  readonly children: ReactNode;
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  // const { t } = useTranslation();

  return (
    <div style={FallbackWrap}>
      {/* <ErrorBoundaryIcon /> */}
      <p style={FallbackMessage}>
        {/* {t("timeOut.arrorRestartTitle1")} */}
        {"에러 텍스트1"}
        <br />
        {/* {t("timeOut.arrorRestartTitle2")} */}
        {"에러 텍스트2"}
      </p>
      <button style={FallbackButton} onClick={resetErrorBoundary}>
        {/* {t("timeOut.restart")} */}
        {"에러 텍스트3"}
      </button>
    </div>
  );
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={() => {
        globalThis.location.reload();
      }}>
      {children}
    </ErrorBoundary>
  );
}

const FallbackWrap: CSSProperties = {
  width: "100dvw",
  height: "100dvh",
  background: "#FFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  position: "relative",
};

const FallbackMessage: CSSProperties = {
  fontSize: "15px",
  fontWeight: "400",
  lineHeight: "1.4",
  marginTop: "8px",
  color: "#6D747B",
  textAlign: "center",
};

const ErrorMessage: CSSProperties = {
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "1.4",
  color: "red",
  position: "absolute",
  top: "10px",
  left: "50%",
  transform: "translateX(-50%)",
};

const FallbackButton: CSSProperties = {
  background: "#E9ECEF",
  color: "#495057",
  padding: "0 16px",
  height: "48px",
  marginTop: "16px",
  borderRadius: "8px",
  fontSize: "15px",
  lineHeight: "1.4",
  fontWeight: "600",
};
