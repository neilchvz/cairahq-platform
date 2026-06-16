export interface User {
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  title: string;
  manager: string;
  organization: string;
  department: string;
  division: string;
  user_type: string;
}

export function addUserToCSV(currentCSV: string, user: User): string {
  const newRow = [
    user.first_name,
    user.last_name,
    user.login,
    user.email,
    user.title,
    user.manager,
    user.organization,
    user.department,
    user.division,
    user.user_type,
  ].join(',');

  const lines = currentCSV
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  lines.push(newRow);
  return lines.join('\n') + '\n';
}

export function removeUserFromCSV(currentCSV: string, email: string): string {
  const lines = currentCSV.split('\n');
  const header = lines[0];
  const rows = lines.slice(1).filter(line => {
    if (!line.trim()) return false;
    const columns = line.split(',');
    return columns[3] !== email;
  });

  return `${header}\n${rows.join('\n')}\n`;
}

export function generateBranchName(action: 'onboard' | 'offboard', firstName: string, lastName: string): string {
  const name = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-');
  return `feat/${action}-${name}`;
}