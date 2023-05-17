from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager
from django.db.models import Q
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

def upload_to(instance, filename):
    return 'avatars/{filename}'.format(filename=filename)

class CustomUserManager(UserManager):
    def get_by_natural_key(self, username):
        return self.get(Q(**{self.model.USERNAME_FIELD: username}) | Q(**{self.model.EMAIL_FIELD: username}))

class CustomUser(AbstractUser):
    username_validator = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Only alphanumeric characters."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    email = models.EmailField(blank=False, unique=True)
    avatar = models.ImageField("Avatar", upload_to=upload_to, default='avatars/default.jpg')
    bio = models.TextField(null=True, max_length=250)

    class Meta:
        # Fix reverse accessor clashes
        unique_together = ['email']
        swappable = 'AUTH_USER_MODEL'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username
