#ifndef OB64_COMMON_EVENT_MESSAGE_H
#define OB64_COMMON_EVENT_MESSAGE_H

/* Registration takes an initialized queue address and a one-word payload. */
void osSetEventMesg(unsigned int event, void *queue, void *message);

/* The resident osSetEventMesg alias resolves to this entry. */
void func_00023d40(unsigned int event, void *queue, void *message);

#endif
