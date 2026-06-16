import { Router, Request, Response } from 'express';
import { getCSV, createPR } from '../github/client';
import { addUserToCSV, removeUserFromCSV, generateBranchName, User } from '../csv/update';

export const onboardRouter = Router();

onboardRouter.post('/add', async (req: Request, res: Response) => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      login: req.body.email,
      email: req.body.email,
      title: req.body.title,
      manager: req.body.manager || '',
      organization: 'Caira HQ',
      department: req.body.department,
      division: req.body.division,
      user_type: req.body.user_type,
    };

    const { content, sha } = await getCSV();
    const updatedCSV = addUserToCSV(content, user);
    const branchName = generateBranchName('onboard', user.first_name, user.last_name);
    const userName = `${user.first_name} ${user.last_name}`;
    const prUrl = await createPR(branchName, updatedCSV, sha, userName, 'Onboard');

    res.send(`
      <h2>Onboarding request submitted</h2>
      <p>A PR has been opened for <strong>${userName}</strong>.</p>
      <p><a href="${prUrl}" target="_blank">Review and merge the PR to provision the user</a></p>
      <a href="/">Back to form</a>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong. Check the console for details.');
  }
});

onboardRouter.post('/remove', async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;

    const { content, sha } = await getCSV();
    const updatedCSV = removeUserFromCSV(content, email);
    const branchName = generateBranchName('offboard', firstName, lastName);
    const userName = `${firstName} ${lastName}`;
    const prUrl = await createPR(branchName, updatedCSV, sha, userName, 'Offboard');

    res.send(`
      <h2>Offboarding request submitted</h2>
      <p>A PR has been opened to offboard <strong>${userName}</strong>.</p>
      <p><a href="${prUrl}" target="_blank">Review and merge the PR to deprovision the user</a></p>
      <a href="/">Back to form</a>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong. Check the console for details.');
  }
});