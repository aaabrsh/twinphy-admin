export interface Competition {
  name: string;
  description: string;
  is_paid: boolean;
  amount: number;
  type: "image" | "video" | "any";
  rounds: Round[];
}

export interface Round {
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
};

export type CompetitionStatus = "scheduled" | "started" | "ended" | "cancelled";
export type CompetitionChangedStatus = "started" | "ended" | "cancelled";
