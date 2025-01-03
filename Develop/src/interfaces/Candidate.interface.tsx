//Create an interface for the Candidate objects returned by the API
export interface Candidate {
    avatar: string;
    name: string;
    location: string;
    email: string;
    username: string;
    company: string;
    html_url: string;
    id: number;
}