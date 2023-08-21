import { web } from "./apps/web.js";
import { logger } from "./apps/logging.js";

web.listen(3000, "0.0.0.0", () => {
  logger.info("App start");
});
