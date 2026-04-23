export const calculateMetrics = (data) => {
    const { deployments, prs, issues, bugs } = data;

    // 1. Lead Time for Changes: PR opened -> successful production deployment
    let leadTimeDays = 0;
    const prsWithDeploy = prs.filter(pr => pr.deployedAt);
    if (prsWithDeploy.length > 0) {
        const leadTimes = prsWithDeploy.map(pr => {
            const opened = new Date(pr.openedAt);
            const deployed = new Date(pr.deployedAt);
            return (deployed - opened) / (1000 * 60 * 60 * 24); // in days
        });
        leadTimeDays = leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length;
    }

    // 2. Cycle Time: Issue In Progress -> Done
    let cycleTimeDays = 0;
    if (issues.length > 0) {
        const cycleTimes = issues.map(iss => {
            const started = new Date(iss.startedAt);
            const completed = new Date(iss.completedAt);
            return (completed - started) / (1000 * 60 * 60 * 24);
        });
        cycleTimeDays = cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length;
    }

    // 3. Bug Rate: Escaped production bugs / issues completed
    let bugRate = 0;
    if (issues.length > 0) {
        bugRate = (bugs.length / issues.length) * 100; // as percentage
    }

    // 4. Deployment Frequency: Count of successful production deployments
    const successfulDeployments = deployments.filter(d => d.status === 'success').length;

    // 5. PR Throughput: Count of merged PRs
    const mergedPRs = prs.filter(pr => pr.mergedAt).length;

    return [
        {
            id: 'lead-time',
            title: 'Lead Time for Changes',
            value: `${leadTimeDays.toFixed(1)} days`,
            interpretation: leadTimeDays > 3 
                ? "Code is taking too long to go from creation to production." 
                : "Excellent flow; code moves quickly from development to users.",
            nextStep: leadTimeDays > 3 
                ? "Investigate CI/CD pipeline bottlenecks or reduce PR review queue times." 
                : "Maintain current continuous delivery practices."
        },
        {
            id: 'cycle-time',
            title: 'Cycle Time',
            value: `${cycleTimeDays.toFixed(1)} days`,
            interpretation: cycleTimeDays > 5 
                ? "Tasks are remaining 'In Progress' for an extended period." 
                : "Tasks are being resolved at a healthy, predictable pace.",
            nextStep: cycleTimeDays > 5 
                ? "Break down Jira issues into smaller, more manageable chunks." 
                : "Use this reliable velocity for better sprint planning."
        },
        {
            id: 'bug-rate',
            title: 'Bug Rate',
            value: `${bugRate.toFixed(1)}%`,
            interpretation: bugRate > 15 
                ? "Quality is slipping; too many issues result in escaped defects." 
                : "High release quality with very few escaped defects.",
            nextStep: bugRate > 15 
                ? "Increase automated test coverage and mandate stricter code reviews." 
                : "Share quality practices with other teams."
        },
        {
            id: 'deployment-freq',
            title: 'Deployment Frequency',
            value: `${successfulDeployments} / month`,
            interpretation: successfulDeployments < 4 
                ? "Deployments are infrequent, increasing the risk of each release." 
                : "Frequent deployments demonstrate a mature continuous delivery capability.",
            nextStep: successfulDeployments < 4 
                ? "Automate manual deployment steps to enable on-demand releases." 
                : "Monitor infrastructure costs to optimize the deployment pipeline."
        },
        {
            id: 'pr-throughput',
            title: 'PR Throughput',
            value: `${mergedPRs} PRs`,
            interpretation: mergedPRs < 10 
                ? "Low throughput could indicate blocked developers or overly large PRs." 
                : "High throughput indicates active development and unblocked teams.",
            nextStep: mergedPRs < 10 
                ? "Encourage smaller PRs and allocate dedicated time for peer reviews." 
                : "Ensure high PR volume isn't degrading review quality."
        }
    ];
};
