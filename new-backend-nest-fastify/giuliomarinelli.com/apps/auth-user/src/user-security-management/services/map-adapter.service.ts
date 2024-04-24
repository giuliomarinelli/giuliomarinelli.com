import { Injectable } from '@nestjs/common';
import { TokenPairType } from '../enums/token-pair-type.enum';
import { TokenPair } from '../interfaces/token-pair.interface';
import { MapToJson } from 'apps/api-gateway/src/auth-user/interfaces/map-to-object.interface';


@Injectable()
export class MapAdapterService {

    public adaptTokenPairTypeAndTokenPairMap(map: Map<TokenPairType, TokenPair>): MapToJson<TokenPairType, TokenPair> {
        const adaptedMap: MapToJson<TokenPairType, TokenPair> = { map: [{ key: null, value: null }] }
        adaptedMap.map.splice(0, 1)
        const keys = Array.from(map.keys())
        keys.forEach(key => adaptedMap.map.push({
            key,
            value: map.get(key)
        }))
        return adaptedMap
    }


}
