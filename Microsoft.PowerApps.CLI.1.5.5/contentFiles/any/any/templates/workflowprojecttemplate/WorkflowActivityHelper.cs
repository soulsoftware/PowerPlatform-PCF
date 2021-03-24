using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace $safeprojectname$
{
	public class WorkflowActivityHelper
	{
		internal IServiceProvider ServiceProvider
		{
			get;

			private set;
		}

		internal IOrganizationService OrganizationService
		{
			get;

			private set;
		}

		internal IWorkflowContext WorkflowExecutionContext
		{
			get;

			private set;
		}

		internal ITracingService TracingService
		{
			get;

			private set;
		}

		protected WorkflowActivityHelper()
		{
		}

		internal WorkflowActivityHelper(CodeActivityContext executionContext)
		{
			if (executionContext == null)
			{
				throw new ArgumentNullException("serviceProvider");
			}

			// Obtain the execution context service from the service provider.
			this.WorkflowExecutionContext = executionContext.GetExtension<IWorkflowContext>();

			// Obtain the tracing service from the service provider.
			this.TracingService = executionContext.GetExtension<ITracingService>();

			// Obtain the Organization Service factory service from the service provider
			IOrganizationServiceFactory factory = executionContext.GetExtension<IOrganizationServiceFactory>();

			// Use the factory to generate the Organization Service.
			this.OrganizationService = factory.CreateOrganizationService(this.WorkflowExecutionContext.UserId);
		}

		internal void Trace(string message)
		{
			if (string.IsNullOrWhiteSpace(message) || this.TracingService == null)
			{
				return;
			}

			if (this.WorkflowExecutionContext == null)
			{
				this.TracingService.Trace(message);
			}
			else
			{
				this.TracingService.Trace(
					"{0}, Correlation Id: {1}, Initiating User: {2}",
					message,
					this.WorkflowExecutionContext.CorrelationId,
					this.WorkflowExecutionContext.InitiatingUserId);
			}
		}
	}
}