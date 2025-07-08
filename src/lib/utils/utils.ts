import type { GameResponse, GenericResponseTypes, PayloadMap } from "../types";

function createResponseObject<T extends GenericResponseTypes>(
    type: T,
    payload: PayloadMap[T]
): GameResponse {
    return {
        type: type,
        payload: payload,
    } as GameResponse;
}

function addNarrationResponses(
    responses: {
        type: Exclude<GenericResponseTypes, "stats">;
        text: string;
    }[]
): GameResponse[] {
    const responseList: GameResponse[] = [];
    for (const { type, text } of responses) {
        responseList.push(createResponseObject(type, { text }));
    }
    return responseList;
}

export { createResponseObject, addNarrationResponses };
