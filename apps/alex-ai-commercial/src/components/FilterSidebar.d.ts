interface FilterSidebarProps {
    filters: {
        location: string;
        workLifeBalance: number;
        alexAIScore: number;
        salaryRange: string;
        companyTypes: string[];
    };
    onFiltersChange: (filters: {
        location: string;
        workLifeBalance: number;
        alexAIScore: number;
        salaryRange: string;
        companyTypes: string[];
    }) => void;
    skillPriorities: Record<string, number>;
    onSkillPrioritiesChange: (priorities: Record<string, number>) => void;
}
export default function FilterSidebar({ filters, onFiltersChange, skillPriorities, onSkillPrioritiesChange }: FilterSidebarProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=FilterSidebar.d.ts.map