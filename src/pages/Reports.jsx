import { useEffect,useMemo,useState } from 'react';
import { BarChart3,ShoppingBag,DollarSign,Users,PackageSearch } from 'lucide-react';
import { AreaChart,Area,BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell } from 'recharts';
import { PageHeader,KpiCard,Empty } from '../components/UI';
import { api } from '../api/client';

const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(n)||0);
const PIE_COLORS=['#111111','#555555','#8b8b8b','#b8b8b8','#d9d9d9','#efefef'];

export default function Reports(){
  const[data,setData]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  useEffect(()=>{api('/admin/analytics').then(d=>setData(d.analytics)).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
  const categories=useMemo(()=>{const rows=data?.categorySales||[];const total=rows.reduce((s,x)=>s+(x.revenue||0),0);return rows.map(x=>({name:x._id||'Uncategorized',value:total?Math.round((x.revenue/total)*1000)/10:0,revenue:x.revenue,units:x.units}))},[data]);
  if(loading)return <><PageHeader title="Reports & analytics" description="Live commerce performance based on database orders."/><div className="card p-10 text-center text-sm text-neutral-500">Loading analytics…</div></>;
  const s=data?.summary||{};
  return <><PageHeader title="Reports & analytics" description="Measure order value, order volume, product performance and customer activity from real order data."/>
    {error&&<div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Order value" value={money(s.revenue)} icon={DollarSign} meta="Excludes cancelled orders"/>
      <KpiCard label="Orders" value={(s.orders||0).toLocaleString()} icon={ShoppingBag}/>
      <KpiCard label="Average order value" value={money(s.avg)} icon={BarChart3}/>
      <KpiCard label="Returning customers" value={(s.returningCustomers||0).toLocaleString()} icon={Users} meta={`${s.newCustomers||0} new customers in reporting window`}/>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_.75fr]">
      <div className="card p-5"><p className="text-sm font-semibold">Sales over time</p><p className="mt-1 text-xs text-neutral-400">Last seven calendar months with order activity</p><div className="mt-5 h-[310px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data?.monthly||[]}><CartesianGrid vertical={false} stroke="#eee"/><XAxis dataKey="name" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip formatter={(v,k)=>k==='revenue'?money(v):v}/><Area type="monotone" dataKey="revenue" stroke="#111" fill="#111" fillOpacity={.08} strokeWidth={2}/></AreaChart></ResponsiveContainer></div></div>
      <div className="card p-5"><p className="text-sm font-semibold">Sales by category</p><p className="mt-1 text-xs text-neutral-400">Share of product order value</p>{categories.length?<><div className="h-[240px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3}>{categories.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie><Tooltip formatter={v=>`${v}%`}/></PieChart></ResponsiveContainer></div><div className="grid grid-cols-2 gap-2">{categories.slice(0,6).map(x=><div className="rounded-xl bg-neutral-50 p-3" key={x.name}><p className="truncate text-xs text-neutral-400">{x.name}</p><p className="mt-1 font-semibold">{x.value}%</p></div>)}</div></>:<Empty title="No category sales yet" text="Category contribution will appear after orders are placed."/>}</div>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-2">
      <div className="card p-5"><p className="text-sm font-semibold">Orders by month</p><div className="mt-5 h-[260px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.monthly||[]}><CartesianGrid vertical={false} stroke="#eee"/><XAxis dataKey="name" axisLine={false} tickLine={false}/><YAxis allowDecimals={false} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="orders" fill="#111" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div>
      <div className="card p-5"><p className="text-sm font-semibold">Best-selling products</p><div className="mt-5 space-y-4">{(data?.popular||[]).map((p,i)=><div className="flex items-center gap-3" key={String(p._id||i)}><span className="w-5 text-xs font-semibold text-neutral-400">{String(i+1).padStart(2,'0')}</span>{p.image?<img src={p.image} alt="" className="h-11 w-11 rounded-xl object-cover"/>:<div className="grid h-11 w-11 place-items-center rounded-xl bg-neutral-100"><PackageSearch className="h-4 w-4 text-neutral-400"/></div>}<div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.name}</p><p className="text-xs text-neutral-400">{p.units} units sold</p></div><p className="text-sm font-semibold">{money(p.revenue)}</p></div>)}{!(data?.popular||[]).length&&<Empty title="No product sales yet" text="Best sellers will appear after completed order activity."/>}</div></div>
    </div>
  </>
}
