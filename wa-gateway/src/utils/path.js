import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const authpath = path.join(dirname, '../../auth_info');

export { dirname, filename, authpath };