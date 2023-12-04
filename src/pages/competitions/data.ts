export interface Competition {
  name: string;
  description: string;
  is_paid: boolean;
  amount: number;
  type: "image" | "video" | "any";
  rounds: Round[];
  result_date: Date | null;
}

export interface Round {
  name: string;
  start_date: Date | null;
  end_date: Date | null;
  min_likes: number;
}

export const INITIAL_DATA: Competition = {
  name: "",
  description: "",
  is_paid: false,
  amount: 0,
  type: "any",
  rounds: [],
  result_date: null,
};

export type CompetitionStatus = "scheduled" | "started" | "ended" | "cancelled";
export type CompetitionChangedStatus = "started" | "ended" | "cancelled";
