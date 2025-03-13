export interface Pagination {
    current_page: number;
    from: number;
    to: number;
    total: number;
    last_page: number;
    per_page: number;
    data: array;
    links: array;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string |null ;
    path: string;
}
