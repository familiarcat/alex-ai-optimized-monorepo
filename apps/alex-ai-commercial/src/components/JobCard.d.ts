import { JobOpportunity, Contact } from '@/lib/n8n-data-service';
interface JobCardProps {
    job: JobOpportunity;
    contacts: Contact[];
    onApply: () => void;
    onSelect: () => void;
    isSelected: boolean;
}
export default function JobCard({ job, contacts, onApply, onSelect, isSelected }: JobCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=JobCard.d.ts.map