import { Dijkstra } from './dijkstra';
import { konigsberg } from './konigsberg';

describe('Common Tests: Graphs: Dijkstra', () => {

    it('Construct Konigsberg', async () => {
       const pathfinder = new Dijkstra(konigsberg);
       //console.log('hi');
    });
});
