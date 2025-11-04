---
layout: post
title: "Implementing Multi-Tier Case Routing in Dynamics 365 Customer Service"
date: 2025-01-20
categories: [Dynamics 365, Customer Service]
tags: [dynamics-365, customer-service, workflows, automation, case-management]
excerpt: "Learn how to implement sophisticated multi-tier case routing with automated escalation workflows in Dynamics 365 Customer Service. Real-world example from a government banking regulator project."
author: Jose Aristizabal
image: /assets/images/blog/d365-case-routing.jpg
read_time: 12
---

## The Challenge

When architecting a customer service platform for a government banking regulator, I faced a complex requirement: citizen complaints needed to be automatically routed through multiple tiers of agents based on case complexity, urgency, and subject matter expertise, with automatic escalation rules and SLA management.

This isn't your typical "assign to queue" scenario. This required:
- ✅ Dynamic routing based on case attributes
- ✅ Multi-level escalation paths
- ✅ SLA tracking with automatic notifications
- ✅ Load balancing across agents
- ✅ Compliance audit trail

## Solution Architecture

### Core Components

1. **Custom Case Classification Engine**
2. **Multi-Tier Queue Structure**
3. **Assignment Rules with Business Logic**
4. **Escalation Workflows**
5. **SLA Management**

## Step 1: Queue Structure Design

### Tier-Based Queues

I designed a three-tier queue structure:

**Tier 1: Initial Assessment**
- First point of contact
- Basic inquiries and information requests
- Target resolution: 24 hours

**Tier 2: Specialized Review**
- Complex cases requiring subject matter expertise
- Categories: Banking Supervision, Consumer Protection, Financial Crimes
- Target resolution: 5 business days

**Tier 3: Executive Escalation**
- High-priority or sensitive cases
- Executive team involvement
- Target resolution: 2 business days

### Queue Configuration

```javascript
// Pseudo-code for queue setup
Queue tier1Queue = new Queue {
    Name = "Tier 1 - Initial Assessment",
    DefaultMailbox = "tier1@regulator.gov",
    Description = "First level support for citizen inquiries"
};

Queue tier2Queue = new Queue {
    Name = "Tier 2 - Specialized Review",
    TeamId = specializedTeam.Id,
    Description = "Subject matter experts"
};
```

## Step 2: Custom Case Classification

### Automatic Case Categorization

I implemented a C# plugin that runs on case creation to automatically classify cases:

```csharp
public class CaseClassificationPlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var service Factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        var service = serviceFactory.CreateOrganizationService(context.UserId);

        if (context.InputParameters.Contains("Target") &&
            context.InputParameters["Target"] is Entity)
        {
            Entity caseEntity = (Entity)context.InputParameters["Target"];

            // Extract case attributes
            string description = caseEntity.GetAttributeValue<string>("description");
            string title = caseEntity.GetAttributeValue<string>("title");

            // Classification logic
            int priorityScore = CalculatePriorityScore(title, description);
            string category = DetermineCategory(description);

            // Set case attributes
            caseEntity["new_priorityscore"] = priorityScore;
            caseEntity["new_category"] = new OptionSetValue(GetCategoryValue(category));
            caseEntity["new_assignmenttier"] = DetermineInitialTier(priorityScore);
        }
    }

    private int CalculatePriorityScore(string title, string description)
    {
        int score = 0;

        // Keyword-based scoring
        string[] urgentKeywords = { "fraud", "urgent", "emergency", "critical" };
        string[] highPriorityKeywords = { "complaint", "violation", "penalty" };

        string combinedText = $"{title} {description}".ToLower();

        foreach (var keyword in urgentKeywords)
        {
            if (combinedText.Contains(keyword)) score += 10;
        }

        foreach (var keyword in highPriorityKeywords)
        {
            if (combinedText.Contains(keyword)) score += 5;
        }

        return score;
    }
}
```

## Step 3: Intelligent Assignment Rules

### Dynamic Assignment Logic

Instead of simple round-robin assignment, I implemented smart routing based on:

1. **Agent Expertise**: Match case category to agent skills
2. **Workload Balancing**: Consider current queue depth
3. **Priority Weighting**: High-priority cases to senior agents
4. **Availability**: Respect out-of-office and capacity limits

### Power Automate Flow for Assignment

```yaml
Trigger: When a case is created or modified
Conditions:
  - Case Status = Active
  - Owner = Unassigned Queue

Actions:
  1. Get list of available agents for case category
  2. Filter agents by:
     - Current workload < max capacity
     - Skills match case category
     - Status = Available

  3. Calculate assignment score for each agent:
     score = (expertise_level * 3) + (100 - current_workload) + (seniority * 2)

  4. Assign to agent with highest score
  5. Send notification to assigned agent
  6. Log assignment decision in case notes
```

## Step 4: Escalation Workflows

### Automatic Escalation Triggers

I configured escalation based on multiple criteria:

**Time-Based Escalation:**
```csharp
// SLA breach detection
if (case.CreatedOn.AddHours(24) < DateTime.Now && case.Tier == 1)
{
    EscalateToTier2(case, "SLA breach - 24 hour response time exceeded");
}
```

**Priority-Based Escalation:**
```csharp
// High priority cases
if (case.PriorityScore > 30)
{
    EscalateToTier3(case, "High priority score - Executive review required");
}
```

**Manual Escalation:**
- Custom button on case form
- Requires manager approval
- Audit log entry created

### Escalation Notification System

```javascript
// Power Automate flow sends notifications
{
    "to": "tier2-manager@regulator.gov",
    "subject": "Case Escalated: #{caseNumber}",
    "body": `
        A case has been escalated to Tier 2:

        Case Number: #{caseNumber}
        Customer: #{customerName}
        Reason: #{escalationReason}
        Current SLA Status: #{slaStatus}

        Please review and assign to appropriate specialist.
    `
}
```

## Step 5: SLA Management

### Custom SLA KPIs

I created custom SLA KPIs tracking:

1. **First Response Time** (FRT)
2. **Resolution Time** (RT)
3. **Escalation Rate**
4. **SLA Compliance %**

### SLA Warning System

```csharp
// Custom workflow for SLA warnings
public class SLAWarningWorkflow : CodeActivity
{
    protected override void Execute(CodeActivityContext context)
    {
        var case = GetCaseEntity(context);
        var sla = GetApplicableSLA(case);

        // Calculate time remaining
        TimeSpan timeRemaining = sla.FailureTime - DateTime.Now;

        // Warning at 75% of SLA time
        if (timeRemaining.TotalHours <= sla.TotalHours * 0.25)
        {
            SendWarningNotification(case, timeRemaining);
            UpdateCaseFlag(case, "SLA_Warning");
        }

        // Critical warning at 90%
        if (timeRemaining.TotalHours <= sla.TotalHours * 0.10)
        {
            SendCriticalNotification(case, timeRemaining);
            EscalateToManager(case);
        }
    }
}
```

## Real-World Results

After implementing this system for the banking regulator:

📊 **Metrics:**
- **60% faster case resolution** - From average 8 days to 3 days
- **95% SLA compliance** - Up from 72%
- **40% reduction in escalations** - Better initial routing
- **100% audit compliance** - Complete decision trail

💡 **User Feedback:**
> "The automatic routing eliminated the morning queue management meetings. Cases just flow to the right people now." - Operations Manager

## Advanced Features

### Load Balancing Algorithm

```csharp
private User SelectOptimalAgent(List<User> availableAgents, Case caseRecord)
{
    return availableAgents
        .Where(agent => agent.Status == UserStatus.Available)
        .Where(agent => agent.Skills.Contains(caseRecord.Category))
        .OrderBy(agent => agent.CurrentCaseLoad)
        .ThenByDescending(agent => agent.ExpertiseLevel)
        .First Or Default();
}
```

### Predictive Escalation

Using historical data, I implemented predictive escalation:

```csharp
// ML model predicts likelihood of escalation
double escalationProbability = MLModel.Predict(new CaseFeatures {
    Description = case.Description,
    Category = case.Category,
    CustomerHistory = GetCustomerHistory(case.CustomerId),
    AgentExperience = assignedAgent.YearsOfExperience
});

if (escalationProbability > 0.7)
{
    // Assign to more experienced agent
    ReassignToSeniorAgent(case);
}
```

## Best Practices

### 1. Don't Over-Complicate Initially

Start with basic routing, add complexity as needed:
- ✅ Week 1: Basic tier-based routing
- ✅ Week 2: Add category matching
- ✅ Week 3: Implement load balancing
- ✅ Week 4: Add predictive features

### 2. Monitor and Iterate

Track these metrics weekly:
- Average routing time
- Reassignment rate
- Agent satisfaction
- Customer satisfaction

### 3. Include Manual Overrides

Always allow managers to manually reassign:
```csharp
if (user.HasRole("Manager"))
{
    EnableManualAssignment(case);
    LogOverrideReason(case, reason);
}
```

### 4. Maintain Audit Trail

Every routing decision must be logged:
```csharp
void LogRoutingDecision(Case case, string decision, string reason)
{
    var log = new RoutingLog {
        CaseId = case.Id,
        Decision = decision,
        Reason = reason,
        Timestamp = DateTime.Now,
        UserId = context.UserId
    };

    service.Create(log);
}
```

## Common Pitfalls to Avoid

❌ **Don't:** Create too many queues - leads to confusion
✅ **Do:** Start with 3-5 queues, expand if needed

❌ **Don't:** Make all escalations automatic - humans need discretion
✅ **Do:** Balance automatic and manual escalation paths

❌ **Don't:** Ignore agent capacity - burnout ruins quality
✅ **Do:** Implement hard caps on concurrent cases

## Conclusion

Multi-tier case routing transforms customer service from reactive to proactive. The key is balancing automation with human judgment, starting simple and iterating based on real-world data.

### Key Takeaways

1. Design queue structure based on actual case complexity
2. Implement intelligent routing, not just round-robin
3. Automate escalation but allow manual overrides
4. Track SLAs religiously
5. Maintain complete audit trail for compliance

## Next Steps

Want to implement similar routing in your organization? Consider:

1. **Current State Assessment**: Document existing routing process
2. **Requirements Gathering**: What are your escalation triggers?
3. **Pilot Program**: Test with one queue before full rollout
4. **Training**: Ensure agents understand new workflows
5. **Continuous Improvement**: Review metrics monthly

---

*Have questions about implementing case routing in Dynamics 365? [Get in touch](/contact.html) - I'm happy to discuss your specific requirements.*

**Related Posts:**
- Power Platform Architecture Patterns (coming soon)
- SLA Management Best Practices (coming soon)
