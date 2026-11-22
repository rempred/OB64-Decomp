#include "common/audio_filter.h"

/* ROM 1FBA0..1FC50; writable pointer storage stays with original ASM.
 * The 800AA710 binding is independently visible in both entry bodies and
 * the already accepted func_000201c8 producer. */
extern struct L4Synth *data_800AA710;
#define L4_GLOBALS data_800AA710
extern void func_0001fd20(struct L4Synth *, struct L4Config *);
extern void func_00020360(void);

void func_0001fba0(struct L4Synth *globals, struct L4Config *config)
{
    if (!L4_GLOBALS) {
        L4_GLOBALS = globals;
        func_0001fd20(globals, config);
    }
}

void func_0001fbcc(void)
{
    if (L4_GLOBALS) {
        func_00020360();
        L4_GLOBALS = 0;
    }
}

void list_insert_head(L4Link *link, L4Link *head)
{
    link->next = head->next;
    link->prev = head;
    if (head->next)
        head->next->prev = link;
    head->next = link;
}

void list_unlink(L4Link *link)
{
    if (link->next)
        link->next->prev = link->prev;
    if (link->prev)
        link->prev->next = link->next;
}

