export const metadata = {
  title: "Mobius Paper",
  description: "A4 paper looping into itself in 3D space"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
