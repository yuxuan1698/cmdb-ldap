
from common.utils import SendEMail
from celery import shared_task
import os


@shared_task
def send_register_email(to,subject,data):
    status=SendEMail(to,subject,data)
    if status:
        return True