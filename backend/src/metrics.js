export const calculateMetrics = (data, targetDeveloper, targetMonth) => {
    let { deployments, prs, issues, bugs } = data;

    // Filter by developer
    if (targetDeveloper && targetDeveloper !== 'All') {
        deployments = deployments.filter(d => d.developer === targetDeveloper);
        prs = prs.filter(pr => pr.developer === targetDeveloper);
        issues = issues.filter(iss => iss.developer === targetDeveloper);
        bugs = bugs.filter(bug => bug.developer === targetDeveloper);
    }

    // Filter by month (YYYY-MM). Important: filter based on specific timestamp fields as requested.
    if (targetMonth && targetMonth !== 'All') {
        deployments = deployments.filter(d => d.timestamp && d.timestamp.startsWith(targetMonth));
        prs = prs.filter(pr => pr.mergedAt && pr.mergedAt.startsWith(targetMonth));
        issues = issues.filter(iss => iss.completedAt && iss.completedAt.startsWith(targetMonth));
        bugs = bugs.filter(bug => bug.reportedAt && bug.reportedAt.startsWith(targetMonth));
    }

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
                ? `Code changes are taking an average of ${leadTimeDays.toFixed(1)} days to reach production, which indicates friction in the delivery pipeline. This delay often points to long queue times during the PR review process or manual, slow CI/CD steps. Reducing this time will help deliver value to users much faster and reduce merge conflicts.` 
                : `Your code changes are flowing into production in just ${leadTimeDays.toFixed(1)} days, showcasing an excellent, smooth delivery pipeline. This rapid turnaround means you are delivering continuous value and getting fast feedback from users. Keep leaning into small, frequent commits to maintain this momentum.`,
            nextStep: leadTimeDays > 3 
                ? "Investigate CI/CD pipeline bottlenecks or reduce PR review queue times." 
                : "Maintain current continuous delivery practices."
        },
        {
            id: 'cycle-time',
            title: 'Cycle Time',
            value: `${cycleTimeDays.toFixed(1)} days`,
            interpretation: cycleTimeDays > 5 
                ? `Tasks are sitting in the 'In Progress' state for over 5 days on average. This typically happens when requirements are unclear, tasks are too large, or developers are dealing with frequent context switching. Breaking these features into smaller, independently testable slices will help restore a healthy development velocity.` 
                : `Tasks are moving from 'In Progress' to 'Done' at a very healthy pace of ${cycleTimeDays.toFixed(1)} days. This consistent velocity suggests that issues are well-scoped and the development workflow is free of major blockers. It provides a highly predictable foundation for future sprint planning.`,
            nextStep: cycleTimeDays > 5 
                ? "Break down Jira issues into smaller, more manageable chunks." 
                : "Use this reliable velocity for better sprint planning."
        },
        {
            id: 'bug-rate',
            title: 'Bug Rate',
            value: `${bugRate.toFixed(1)}%`,
            interpretation: bugRate > 15 
                ? `The defect escape rate has reached ${bugRate.toFixed(1)}%, indicating that a significant portion of completed work is resulting in production issues. This suggests that the current testing strategies—whether automated or manual—are failing to catch edge cases before release. A concerted effort to bolster automated test coverage is needed to restore confidence in the release process.` 
                : `A bug rate of ${bugRate.toFixed(1)}% highlights a strong culture of quality and meticulous code review. Very few defects are slipping through the cracks into the production environment. This high release quality protects the user experience and minimizes time spent on urgent hotfixes.`,
            nextStep: bugRate > 15 
                ? "Increase automated test coverage and mandate stricter code reviews." 
                : "Share quality practices with other teams."
        },
        {
            id: 'deployment-freq',
            title: 'Deployment Frequency',
            value: `${successfulDeployments}`,
            interpretation: successfulDeployments < 4 
                ? `With only ${successfulDeployments} successful deployments in this timeframe, the team is likely batching large amounts of work into risky, infrequent releases. This "big bang" approach increases the likelihood of production outages and makes debugging significantly harder. Moving towards smaller, more frequent releases will reduce overall deployment risk.` 
                : `Achieving ${successfulDeployments} deployments in this timeframe demonstrates a highly mature continuous delivery capability. By releasing smaller increments frequently, you are drastically reducing the risk associated with any single deployment. This approach also ensures that features and bug fixes reach users as quickly as possible.`,
            nextStep: successfulDeployments < 4 
                ? "Automate manual deployment steps to enable on-demand releases." 
                : "Monitor infrastructure costs to optimize the deployment pipeline."
        },
        {
            id: 'pr-throughput',
            title: 'PR Throughput',
            value: `${mergedPRs}`,
            interpretation: mergedPRs < 10 
                ? `A throughput of just ${mergedPRs} merged PRs indicates that code isn't moving efficiently through the review phase. Developers might be blocked waiting on feedback, or the pull requests themselves might be too large and intimidating to review quickly. Fostering a culture of smaller PRs and prompt peer reviews will help unblock the flow of work.` 
                : `A high throughput of ${mergedPRs} merged PRs is a strong indicator of active, unblocked development. The team is successfully collaborating and reviewing code without letting it pile up in the queue. It is important to monitor that this high volume doesn't come at the cost of diminished code review quality.`,
            nextStep: mergedPRs < 10 
                ? "Encourage smaller PRs and allocate dedicated time for peer reviews." 
                : "Ensure high PR volume isn't degrading review quality."
        }
    ];
};
