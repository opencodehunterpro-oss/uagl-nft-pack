// Merkle Tree Whitelist Generator

const crypto = require('crypto');

class MerkleTree {
    constructor(leaves) {
        this.leaves = leaves.map(leaf => this.hash(leaf));
        this.layers = [this.leaves];
        this.createLayers();
    }

    hash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    createLayers() {
        let currentLayer = this.leaves;
        while (currentLayer.length > 1) {
            currentLayer = this.createNextLayer(currentLayer);
            this.layers.push(currentLayer);
        }
    }

    createNextLayer(currentLayer) {
        const nextLayer = [];
        for (let i = 0; i < currentLayer.length; i += 2) {
            const left = currentLayer[i];
            const right = currentLayer[i + 1] || currentLayer[i];
            nextLayer.push(this.hash(left + right));
        }
        return nextLayer;
    }

    getRoot() {
        return this.layers[this.layers.length - 1][0];
    }

    getProof(leaf) {
        const leafHash = this.hash(leaf);
        const proof = [];
        let index = this.leaves.indexOf(leafHash);
        if (index === -1) return proof;

        for (let i = 0; i < this.layers.length - 1; i++) {
            const layer = this.layers[i];
            const isLeftNode = index % 2 === 0;
            const pairIndex = isLeftNode ? index + 1 : index - 1;
            if (pairIndex < layer.length) {
                proof.push(layer[pairIndex]);
            }
            index = Math.floor(index / 2);
        }
        return proof;
    }
}

// Example usage
const whitelist = ['user1', 'user2', 'user3'];
const merkleTree = new MerkleTree(whitelist);

console.log('Merkle Root:', merkleTree.getRoot());
console.log('Proof for user1:', merkleTree.getProof('user1'));