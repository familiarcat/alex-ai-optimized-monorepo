interface StatsDashboardProps {
    totalJobs: number;
    stLouisJobs: number;
    remoteJobs: number;
    highScoreJobs: number;
    applications: number;
    onExportContacts?: () => void;
    onGenerateReport?: () => void;
    onRefreshData?: () => void;
}
export default function StatsDashboard({ totalJobs, stLouisJobs, remoteJobs, highScoreJobs, applications, onExportContacts, onGenerateReport, onRefreshData }: StatsDashboardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=StatsDashboard.d.ts.map