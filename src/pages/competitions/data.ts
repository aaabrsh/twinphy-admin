export interface Competition {
  name: string;
  description: string;
  start_date: Date | null;
  end_date: Date | null;
  is_paid: boolean;
  amount: number;
}

export const INITIAL_DATA: Competition = {
  name: "",
  description: "",
  start_date: null,
  end_date: null,
  is_paid: false,
  amount: 0,
};
