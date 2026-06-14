import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function LoadingSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "oklch(0.975 0.008 50)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid oklch(0.9 0.012 30)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1152,
          margin: "0 auto",
        }}
      >
        <div>
          <div
            style={{
              height: 12,
              width: 80,
              borderRadius: 6,
              background: "oklch(0.9 0.012 30)",
              marginBottom: 6,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: 18,
              width: 160,
              borderRadius: 6,
              background: "oklch(0.9 0.012 30)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[48, 44, 52, 60, 68].map((w, i) => (
            <div
              key={i}
              style={{
                height: 32,
                width: w,
                borderRadius: 8,
                background: "oklch(0.9 0.012 30)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          borderBottom: "1px solid oklch(0.9 0.012 30)",
          padding: "56px 16px",
          maxWidth: 1152,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            height: 10,
            width: 160,
            borderRadius: 6,
            background: "oklch(0.88 0.03 20)",
            marginBottom: 16,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 48,
            width: 320,
            borderRadius: 8,
            background: "oklch(0.9 0.012 30)",
            marginBottom: 16,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 16,
            width: 420,
            borderRadius: 6,
            background: "oklch(0.9 0.012 30)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            height: 24,
            width: 100,
            borderRadius: 6,
            background: "oklch(0.9 0.012 30)",
            marginBottom: 20,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: 16,
                border: "1px solid oklch(0.9 0.012 30)",
                overflow: "hidden",
                background: "white",
              }}
            >
              <div
                style={{
                  aspectRatio: "5/4",
                  background: "oklch(0.93 0.025 20)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    height: 10,
                    width: 60,
                    borderRadius: 4,
                    background: "oklch(0.9 0.012 30)",
                    marginBottom: 8,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    height: 18,
                    width: "80%",
                    borderRadius: 6,
                    background: "oklch(0.9 0.012 30)",
                    marginBottom: 12,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    height: 12,
                    width: 100,
                    borderRadius: 4,
                    background: "oklch(0.9 0.012 30)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: LoadingSkeleton,
    defaultPendingMs: 200,
  });

  return router;
};
