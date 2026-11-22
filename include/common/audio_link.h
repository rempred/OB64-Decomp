#ifndef OB64_COMMON_AUDIO_LINK_H
#define OB64_COMMON_AUDIO_LINK_H

typedef struct L4Link {
    struct L4Link *next;
    struct L4Link *prev;
} L4Link;

typedef L4Link ALLink;

void list_insert_head(L4Link *link, L4Link *head);
void list_unlink(L4Link *link);
void alLink(ALLink *link, ALLink *head);
void alUnlink(ALLink *link);

#endif
