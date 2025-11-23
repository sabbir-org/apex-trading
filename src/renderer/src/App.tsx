import { Layout } from "@/components"
import { Route, Routes } from "react-router"
import { Customer, Dashboard, Ledger, NewPurchase, NewSale, Product, Supplier } from "./pages"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard></Dashboard>}></Route>
        <Route path="/product" element={<Product></Product>}></Route>
        <Route path="/customer" element={<Customer></Customer>}></Route>
        <Route path="/supplier" element={<Supplier></Supplier>}></Route>
        <Route path="/ledger" element={<Ledger></Ledger>}></Route>
        <Route path="/newsale" element={<NewSale></NewSale>}></Route>
        <Route path="/newpurchase" element={<NewPurchase></NewPurchase>}></Route>
      </Routes>
    </Layout>
  )
}

export default App
