import { ImageResponse } from "next/og";

// Branded social-share card used for og:image + twitter:image across the site.
export const alt = "Leo Dispatch Inc — We find the loads. You drive.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(120% 120% at 0% 0%, #1a1500 0%, #0a0a0a 55%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#FFD400",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🚚
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: "#FFD400",
            }}
          >
            LEO DISPATCH INC
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "48px",
            fontSize: "82px",
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: "950px",
          }}
        >
          We find the loads. You drive.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "32px",
            fontSize: "34px",
            color: "#bdbdbd",
            maxWidth: "900px",
          }}
        >
          Dedicated truck dispatch for owner operators across all 48 states.
        </div>

        <div style={{ display: "flex", marginTop: "56px", gap: "16px" }}>
          {["24/7 Dispatch", "48 States", "No Forced Dispatch"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "12px 26px",
                borderRadius: "999px",
                border: "2px solid #FFD400",
                color: "#FFD400",
                fontSize: "26px",
                fontWeight: 700,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
