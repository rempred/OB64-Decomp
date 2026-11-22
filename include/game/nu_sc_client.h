#ifndef OB64_GAME_NU_SC_CLIENT_H
#define OB64_GAME_NU_SC_CLIENT_H

struct MessageQueue;

/* The NuSystem scheduler links clients and tests their message masks. */
typedef struct NUScClient_s {
    struct NUScClient_s *next;
    struct MessageQueue *msgQ;
    signed short msgType;
} NUScClient;

typedef char NUScClientSizeCheck[sizeof(NUScClient) == 12 ? 1 : -1];

void func_00019454(NUScClient *client, struct MessageQueue *queue, signed short message_type);
void func_000194e4(NUScClient *client, signed short message_type);
void func_00019524(NUScClient *client);

#endif
