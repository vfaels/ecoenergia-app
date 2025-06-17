import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

// Tipos
interface ResidenceConfig {
  residents: number;
  rooms: number;
  bathrooms: number;
  area: number;
}

interface DailyConsumption {
  day: string;
  consumo: number;
}

interface MonthlyConsumption {
  date: string;
  kwh: number;
}

interface ConsumptionHistory {
  today_kwh: number;
  monthly_goal_kwh: number;
  current_month_kwh: number;
  last_7_days: DailyConsumption[];
  last_30_days: MonthlyConsumption[];
}

interface EnergyTip {
  id: number;
  title: string;
  description: string;
}

// Função para buscar todos os dados
export async function fetchDashboardData() {
  const [residenceRes, consumptionRes, tipsRes] = await Promise.all([
    api.get<ResidenceConfig>("/residence_config"),
    api.get<ConsumptionHistory>("/consumption_history"),
    api.get<EnergyTip[]>("/energy_tips"),
  ]);

  return {
    residence: residenceRes.data,
    consumption: consumptionRes.data,
    tips: tipsRes.data,
  };
}
export default api;