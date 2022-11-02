"""Handler to Load User Reports.

to be triggered via SQS

"""
# IMPORT STANDARD LIBRARIES
import json
import typing

# IMPORT LOCAL LIBRARIES
from lorgs import data # pylint: disable=unused-import
from lorgs import db
from lorgs.models.task import Task
from lorgs.models.warcraftlogs_user_report import UserReport


async def load_user_report(
    report_id: str,
    fight_ids: typing.List[int] = [],
    player_ids: typing.List[int] = [],
    **kwargs
):
    print(f"[load_user_report] report_id={report_id} fight_ids={fight_ids} player_ids={player_ids}")
    if not (report_id and fight_ids and player_ids):
        raise ValueError("Missing fight or player ids")

    ################################
    # loading...
    user_report = UserReport.from_report_id(report_id=report_id, create=True)
    await user_report.report.load_fights(fight_ids=fight_ids, player_ids=player_ids)
    user_report.save()


async def main(message):

    # Task Status Updates
    message_id = message.get("messageId")
    Task.update_task(message_id, status=Task.STATUS_IN_PROGRESS)

    ###########################
    # Main
    message_body = message.get("body")
    message_payload = json.loads(message_body)

    try:
        await load_user_report(**message_payload)
    except:
        Task.update_task(message_id, status=Task.STATUS_FAILED)
    else:
        Task.update_task(message_id, status=Task.STATUS_DONE)