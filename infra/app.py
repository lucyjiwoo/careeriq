import os

import aws_cdk as cdk

from stacks.zzuck_stack import ZzuckStack

app = cdk.App()

ZzuckStack(
    app,
    "ZzuckStack",
    env=cdk.Environment(
        account=os.environ.get("CDK_DEFAULT_ACCOUNT"),
        region=os.environ.get("CDK_DEFAULT_REGION", "us-east-1"),
    ),
)

app.synth()
