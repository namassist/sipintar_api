import { web } from "./apps/web.js";
import { logger } from "./apps/logging.js";

web.listen(3000, () => {
  logger.info("App start");
});
