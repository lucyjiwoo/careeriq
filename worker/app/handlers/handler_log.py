import logging

logger = logging.getLogger(__name__)


def handle_message(message: dict) -> None:
    message_type = message.get("type", "unknown")
    logger.info("Handling message type=%s", message_type)
