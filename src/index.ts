import app from './app';
import { settings } from './config/settings';
import { connectDB } from "./config/dataBase";

app.listen(settings.PORT, async () => {
    try {
        await connectDB(settings.DB_NAME);
        console.log(`http://localhost:${settings.PORT}`);
    } catch (e) {
        console.error(e);
    }
});
