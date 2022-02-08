const core = require('@actions/core');
const { context } = require('@actions/github');

const BLOCKING_LABELS = [`flag: 💥 Breaking change`, `flag: don't merge`];

async function main() {
  try {
    const labels = context.payload.pull_request?.labels;
    const milestone = context.payload.pull_request?.milestone;

    const hasBlockingLabel = labels.some(label => BLOCKING_LABELS.includes(label.name));
    if (hasBlockingLabel) {
      core.setFailed(
        `The PR has been labelled with a blocking label (${BLOCKING_LABELS.join(', ')}).`
      );

      return;
    }

    const sourceLabelCount = labels.filter(label => label.name.startsWith('source: ')).length;
    const issueLabelCount = labels.filter(label => label.name.startsWith('issue-type: ')).length;
    const hasMilestone = !!milestone;

    if (sourceLabelCount !== 1) {
      core.setFailed(`The PR must have one and only one 'source:' label.`);
    }

    if (issueLabelCount !== 1) {
      core.setFailed(`The PR must have one and only one 'issue-type:' label.`);
    }

    if (!hasMilestone) {
      core.setFailed(`The PR must have a milestone.`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
