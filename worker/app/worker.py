import logging
import signal
import time

from app.config import settings
from app.handlers.handler_log import handle_message

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)

_running = True


def _handle_shutdown(signum, frame):
    global _running
    logger.info("Shutdown signal received, stopping worker...")
    _running = False


def poll() -> list[dict]:
    """
        Poll for messages to process. Replace with real message queue logic.
    """
    return []


def start_worker() -> None:
    signal.signal(signal.SIGTERM, _handle_shutdown)
    signal.signal(signal.SIGINT, _handle_shutdown)

    logger.info("Worker started (poll_interval=%ds)", settings.poll_interval_seconds)

    while _running:
        messages = poll()
        for message in messages:
            try:
                handle_message(message)
            except Exception:
                logger.exception("Failed to handle message: %s", message)

        time.sleep(settings.poll_interval_seconds)

    logger.info("Worker stopped")
