

from lorgs.data.classes import ALL_SPECS
from lorgs.data.raids import (
    CASTLE_NATHRIA,
    SANCTUM_OF_DOMINATION,
    SEPULCHER_OF_THE_FIRST_ONES
)

fated_bosses = CASTLE_NATHRIA.bosses + SANCTUM_OF_DOMINATION.bosses + SEPULCHER_OF_THE_FIRST_ONES.bosses


PAYLOAD_EXPANDERS = {
    "spec_slug": [spec.full_name_slug for spec in ALL_SPECS],
    "boss_slug": [boss.full_name_slug for boss in fated_bosses],
    "difficulty": ["heroic", "mythic"],
    "metric": ["dps", "hps", "bossdps"],
}


def expand_payload(keyword, payload):
    """"""
    if payload.get(keyword) != "all":
        return [payload]

    values = PAYLOAD_EXPANDERS[keyword]
    return [{**payload, keyword: value} for value in values]


def expand_keyword(keyword, payloads):
    """Expand a single Keyword."""
    result = []
    for payload in payloads:
        result += expand_payload(keyword, payload)
    return result


def expand_keywords(payload, cap=10):
    """Expand a single Payload replacing `all` Keywords with the actual values."""

    payloads = [payload]

    steps = 0
    for keyword in PAYLOAD_EXPANDERS:
        payloads = expand_keyword(keyword, payloads)

        if len(payloads) > 1:
            steps += 1
        
        if steps >= cap:
            return payloads

    return payloads


def queue_arn_to_url(arn: str):
    """Converts an SQS Queue ARN into the URL Version.
    
    >>> queue_arn_to_url("arn:aws:sqs:eu-west-1:12345678:my_queue.fifo")
    https://sqs.eu-west-1.amazonaws.com/12345678/my_queue.fifo

    """
    *_, region, account_id, queue_name = arn.split(":")
    return f"https://sqs.{region}.amazonaws.com/{account_id}/{queue_name}"