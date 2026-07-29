export default async function TestPage() {
  const response = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
  });

  const data = await response.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
