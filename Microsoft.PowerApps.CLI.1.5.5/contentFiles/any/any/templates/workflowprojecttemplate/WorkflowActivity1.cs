using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.Threading.Tasks;
using System.Activities;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System.Runtime.Serialization;

namespace $safeprojectname$
{
	public class Workflow1 : CodeActivity
	{
		//Property for Entity on which the workflow activity needs to be added
		#region Properties 
		// Uncomment below Attributes on property for entity "Account" with description "Test Workflow on Account Entity". Change the fields for entity name & description
		//[RequiredArgument]
		//[Input("Test Workflow on Account Entity")]
		//[ReferenceTarget("account")]
		//public InArgument<EntityReference> Account { get; set; }
		#endregion

		protected override void Execute(CodeActivityContext context)
		{
			if (context == null)
			{
				throw new ArgumentNullException("codeactivitycontext");
			}

			//If you decide not to use the service helper object, then instantiate different services here.
			//Do not use the services IServiceProvider, ITracingService, IOrganizationService, IWorkflowContext as class variables.
			//They should be instantiated per execute call.

			// Construct the Local plug-in context.
			WorkflowActivityHelper workflowActivityHelper = new WorkflowActivityHelper(context);
			workflowActivityHelper.Trace(string.Format(CultureInfo.InvariantCulture, "Entered {0}.Execute()", GetType().Name));

			try
			{
				#region Custom Activity Handling logic
				// Implement your custom activity handling.
				#endregion

			}
			catch (FaultException<OrganizationServiceFault> e)
			{
				workflowActivityHelper.Trace(string.Format(CultureInfo.InvariantCulture, "Exception: {0}", e.ToString()));

				//Exception handling goes here
				throw e;
			}
			finally
			{
				//Trace the execute complete
				workflowActivityHelper.Trace(string.Format(CultureInfo.InvariantCulture, "Exiting {0}.Execute()", GetType().Name));
			}
		}
	}
}
