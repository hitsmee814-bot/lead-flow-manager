import logo from "@/assets/images/logoPrimary.png";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Bonhomiee Logo"
                className="h-6 w-6 object-contain"
              />
            </div>

            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "#00AFEF" }}
              >
                Bonhomiee
              </h1>

              <p className="text-sm text-muted-foreground">
                Welcome to the Bonhomiee Admin Portal
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* Empty Admin Dashboard */}
      <main className="container mx-auto px-6 py-8">
      </main>
    </div>
  );
}