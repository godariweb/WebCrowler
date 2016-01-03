package com.lucene.cosinesimilarity;

import java.text.DecimalFormat;

/**
 * Class to calculate cosine similarity
 * @author Mubin Shrestha
 */
public class CosineSimilarity {  
	
    public static String CosineSimilarity(DocVector d1,DocVector d2) {
    	 
        double cosinesimilarity;
        try {
            cosinesimilarity = (d1.vector.dotProduct(d2.vector))
                    / (d1.vector.getNorm() * d2.vector.getNorm());
        } catch (Exception e) {
            return "0.0";
        }
        
        return String.format("%.2f", cosinesimilarity);
    }
}