export interface Article {
  id: string;
  category_major: string;
  category_minor: string;
  title_raw: string;
  content_fact: string;
  content_rumor: string;
  history_rhyme: string;
  truth_score: number;
  scenario_opt: string;
  scenario_pess: string;
  published_at: string;
}